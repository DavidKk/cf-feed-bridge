import type { DoubanRSSDTO } from '../types/douban'
import type { SeriesList } from '../types/feed'
import { withRSS } from '../utils/withRSS'

export const sonarr = withRSS(async (xmlDoc: DoubanRSSDTO) => {
  return extractSeriesListFromDoubanRSSDTO(xmlDoc)
})

function extractSeriesListFromDoubanRSSDTO(dto: DoubanRSSDTO): SeriesList {
  const seriesList: SeriesList = []
  const items = dto.rss.channel.item

  items.forEach((item) => {
    const titleMatch = item.title.match(/^(想看)(.*)$/)
    if (titleMatch && titleMatch[2]) {
      const title = titleMatch[2].trim()
      const tvdbIdMatch = item.link.match(/\/(\d+)\/$/)
      if (tvdbIdMatch && tvdbIdMatch[1]) {
        seriesList.push({
          title,
          seasons: [
            {
              monitored: true,
            },
          ],
        })
      }
    }
  })

  return seriesList
}
