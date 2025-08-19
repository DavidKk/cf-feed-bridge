import { request } from '@/services/request'
import { DAILY_REPORT_HEADERS, DAILY_REPORT_URL } from './constants'
import { parseTasiCompaniesDaily } from './parseTasiCompaniesDaily'

export async function fetchTasiCompaniesDaily() {
  const htmlContent = await fetchDailyReport()
  const records = parseTasiCompaniesDaily(htmlContent)
  return records
}

export async function fetchDailyReport() {
  const response = await request('GET', DAILY_REPORT_URL, {
    headers: {
      ...DAILY_REPORT_HEADERS,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch TASI report')
  }

  return response.text()
}
