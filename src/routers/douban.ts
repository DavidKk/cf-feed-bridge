import type { RouterType } from 'itty-router'
import { sonarr } from '../controllers/douban'

export default function douban(router: RouterType) {
  router.get('/api/douban/sonarr', sonarr)
}
