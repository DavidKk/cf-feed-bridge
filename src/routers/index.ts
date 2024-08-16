import { Router } from 'itty-router'
import { composeRouters } from '@/share/composeRouters'
import douban from './douban'

const initRouter = composeRouters(douban)

const router = Router()
initRouter(router)
router.all('*', () => new Response('Not Found.', { status: 404 }))

export default router
