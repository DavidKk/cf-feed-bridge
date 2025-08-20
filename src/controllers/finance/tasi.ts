import { json } from '@/initializer/json'
import { fetchTasiCompaniesDaily, fetchTasiMarketSummary } from '@/services/finance/tasi'

export const companiesDailyRecords = json(async () => {
  return fetchTasiCompaniesDaily()
})

export const marketDailySummary = json(async () => {
  return fetchTasiMarketSummary()
})
