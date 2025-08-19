import { Router } from 'itty-router'
import { composeRouters } from '@/share/composeRouters'
import douban from './douban'
import finance from './finance'

const initRouter = composeRouters(douban, finance)

const router = Router()
initRouter(router)
router.all('*', () => new Response('Not Found.', { status: 404 }))

export default router
