import { withRSS } from '../utils/withRSS'
import { extractSeriesListFromDoubanRSSDTO } from '../services/douban'
import type { DoubanRSSDTO } from '../types/douban'

export const sonarr = withRSS(async (xmlDoc: DoubanRSSDTO, { use }) => {
  const extract = use(extractSeriesListFromDoubanRSSDTO)
  return extract(xmlDoc)
})
