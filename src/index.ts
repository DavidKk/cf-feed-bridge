import apiRouter from '@/routers'

export default {
  async fetch(req, env, ctx): Promise<Response> {
    const url = new URL(req.url)
    if (url.pathname.startsWith('/api/')) {
      return apiRouter.handle(req, env, ctx)
    }

    return new Response('Not Found.', { status: 404 })
  },
} satisfies ExportedHandler<Env>
