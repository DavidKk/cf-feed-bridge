import type { RouterType } from 'itty-router'
import { companiesDailyRecords, marketDailySummary } from '../controllers/finance/tasi'

export default function finance(router: RouterType) {
  router.get('/api/finance/tasi/company/daily', companiesDailyRecords)
  router.get('/api/finance/tasi/summary/daily', marketDailySummary)
}
