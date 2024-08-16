import type { ControllerContext } from './controller'
import { controller } from './controller'
import { createResponse } from '../share/createResponse'
import { extractRequestParts, matchRequestParts } from '@/utils/extractRequestParts'

export function withTransform<T extends Record<string, any>>(handler: (params: Partial<T>, context: ControllerContext) => Promise<any>) {
  return controller(async (context) => {
    const { req } = context
    const { url, headers } = req
    const uri = new URL(url)
    const query = Object.fromEntries(uri.searchParams.entries())
    const path = uri.pathname
    const body = await (async () => {
      try {
        const content = await req.text()
        return JSON.parse(content)
      } catch (err) {
        return null
      }
    })()

    const requestParts = { query, path, headers, body }
    const params = Object.fromEntries(
      (function* () {
        for (const [name, pattern] of Object.entries(query)) {
          if (!(typeof pattern === 'string' && matchRequestParts(pattern))) {
            continue
          }

          const value = extractRequestParts(pattern, requestParts)
          yield [name, value]
        }
      })()
    )

    try {
      const resp = await handler(params as T, context)
      if (typeof resp !== 'undefined') {
        return new Response(resp)
      }
    } catch (error) {
      return createResponse(error)
    }

    return createResponse('ok')
  })
}
