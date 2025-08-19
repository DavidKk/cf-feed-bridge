import type { RouterType } from 'itty-router'
import { dailyRecords } from '../controllers/finance/tasi'

export default function douban(router: RouterType) {
  router.get('/api/finance/tasi/daily', dailyRecords)
}
