import type { IContext } from '../../initializer/types'
import type { DoubanRSSDTO } from '../../types/douban'
import type { SeriesList } from '../../types/feed'
import { chineseToNumber } from '../../utils/chineseToNumber'
import { fail, info, warn } from '../../utils/logger'
import { searchByTitle as searchByTitleFromTheTVDB } from '../thetvdb'
import { searchTVShowByTitle as searchByTitleFromTMDB } from '../tmdb'

export async function extractSeriesListFromDoubanRSSDTO(context: IContext, dto: DoubanRSSDTO): Promise<SeriesList> {
  const { env } = context
  const items = dto.rss.channel.item
  if (!(Array.isArray(items) && items.length > 0)) {
    return []
  }

  const seriesies: SeriesList = Array.from(
    (function* () {
      for (const item of items) {
        const titleMatch = item.description.match(/title="(.*?)(?:第([零一二三四五六七八九十百千万亿]+?)季)?"/)
        const chineseTitleMatch = item.title.match(/^(?:想看)(.*?)(?:第([零一二三四五六七八九十百千万亿]+?)季)?$/)
        const doubanIdMatch = item.link.match(/\/(\d+)\/$/)
        if (!(chineseTitleMatch && titleMatch)) {
          info(`Skipping item due to no title match: ${item.title}`)
          continue
        }

        const title = titleMatch[1].trim()
        const chineseTitle = chineseTitleMatch?.[1]?.trim() || title
        const seasonNumber = titleMatch[2] ? chineseToNumber(titleMatch[2]) : 1
        const season = { seasonNumber, monitored: true }

        let doubanId: number | undefined = parseInt((doubanIdMatch || [])[1])
        doubanId = isNaN(doubanId) ? undefined : doubanId

        info(`Extracted series: title=${title}, seasonNumber=${seasonNumber}, doubanId=${doubanId}`)

        yield {
          title,
          chineseTitle,
          doubanId: doubanId,
          seasons: [season],
        }
      }
    })()
  )

  info('Extracted series list from Douban RSS DTO:', seriesies)

  const useTMDB = typeof env.TMDB_API_KEY === 'string'
  const useTheTVDB = typeof env.THE_TVDB_API_KEY === 'string'

  if (useTMDB) {
    await Promise.allSettled(
      seriesies.map(async (series) => {
        try {
          const { title } = series
          info(`Searching for series: ${title}`)
          const data = await searchByTitleFromTMDB(context, title)

          if (!(Array.isArray(data) && data.length > 0)) {
            info(`Not found any matching movies for: ${title}`)
            return series
          }

          const detail = data?.[0]
          const tmdbId = detail?.id
          const mediaType = detail?.media_type === 'movie' ? 'movie' : 'series'

          if (tmdbId) {
            info(`Found TMDB ID ${tmdbId} for series: ${title}`)
            series.tmdbId = tmdbId
            series.mediaType = mediaType
          } else {
            info(`No TMDB ID found for series: ${title}`)
          }
        } catch (error) {
          fail(`Something went wrong while processing series: ${series.title}, error: ${error}`)
        }

        return series
      })
    )
  } else if (useTheTVDB) {
    await Promise.allSettled(
      seriesies.map(async (series) => {
        try {
          const { title } = series
          info(`Searching for series: ${title}`)
          const data = await searchByTitleFromTheTVDB(context, title)
          if (!(Array.isArray(data) && data.length > 0)) {
            info(`Not found any matching movies for: ${title}`)
            return series
          }

          const detail = data?.[0]
          const tvdbid = detail?.tvdb_id
          const remoteIds = detail?.remote_ids || []
          const mediaType = detail?.type === 'movie' ? 'movie' : 'series'
          const imdbId = remoteIds.find((id) => id.sourceName === 'IMDB')?.id
          const tmdbId = remoteIds.find((id) => id.sourceName === 'TheMovieDB.com')?.id

          if (tvdbid) {
            info(`Found TVDB ID ${tvdbid} for series: ${title}`)
            series.tvdbId = tvdbid
            series.mediaType = mediaType
          } else {
            info(`No TVDB ID found for series: ${title}`)
          }

          if (imdbId) {
            info(`Found IMDb ID ${imdbId} for series: ${title}`)
            series.imdbId = imdbId
          } else {
            info(`No IMDb ID found for series: ${title}`)
          }

          if (tmdbId) {
            info(`Found TMDB ID ${tmdbId} for series: ${title}`)
            series.tmdbId = tmdbId
          } else {
            info(`No TMDB ID found for series: ${title}`)
          }
        } catch (error) {
          fail(`Something went wrong while processing series: ${series.title}, error: ${error}`)
        }

        return series
      })
    )
  } else {
    warn('No API KEY found in environment, skipping series lookup.')
  }

  info('Final series list with TVDB IDs:', seriesies)
  return seriesies
}
