import { withRSS } from '@/initializer/withRSS'
import { extractSeriesListFromDoubanRSSDTO, type DoubanRSSDTO } from '@/services/douban'

export const sonarr = withRSS(async (xmlDoc: DoubanRSSDTO, { use }) => {
  const extract = use(extractSeriesListFromDoubanRSSDTO)
  return extract(xmlDoc, { onlySeries: true })
})

export const radarr = withRSS(async (xmlDoc: DoubanRSSDTO, { use }) => {
  const extract = use(extractSeriesListFromDoubanRSSDTO)
  return extract(xmlDoc, { onlyMovie: true })
})
