import type { RouterType } from 'itty-router'
import { sonarr, radarr } from '../controllers/douban'

export default function douban(router: RouterType) {
  router.get('/api/douban/sonarr', sonarr)
  router.get('/api/douban/radarr', radarr)
}
