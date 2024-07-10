import { Router } from 'itty-router'

const router = Router()

// GET collection index
router.get('/api/douban-sonarr', () => new Response('Todos Index!'))

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }))

export default router
