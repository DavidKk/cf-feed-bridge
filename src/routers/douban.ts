import { sonarr } from '../controllers/douban'
import type { RouterInstance } from '../types/router'

export default function (router: RouterInstance) {
  router.get('/api/douban/sonarr', sonarr)
}
