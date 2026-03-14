import { request } from '@/services/request'
import { DAILY_REPORT_HEADERS, DAILY_REPORT_URL } from './constants'
import { parseTasiCompaniesDaily } from './parseTasiCompaniesDaily'
import { parseTasiMarketSummary } from './parseTasiMarketSummary'

export async function fetchTasiCompaniesDaily() {
  const htmlContent = await fetchDailyReport()
  return parseTasiCompaniesDaily(htmlContent)
}

export async function fetchTasiMarketSummary() {
  const htmlContent = await fetchDailyReport()
  return parseTasiMarketSummary(htmlContent)
}

export async function fetchDailyReport() {
  const response = await request('GET', DAILY_REPORT_URL, {
    headers: new Headers({
      ...DAILY_REPORT_HEADERS,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch TASI report')
  }

  return response.text()
}
