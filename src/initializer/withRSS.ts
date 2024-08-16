import { XMLParser } from 'fast-xml-parser'
import { RSSHeaders, FeedHeaders } from '../constants/header'
import type { ControllerContext } from '../initializer/controller'
import { controller } from '../initializer/controller'
import { info } from '../services/logger'

export interface WithRSSOptions {
  /** 是否开启缓存，默认读取 env.CACHE */
  useCache?: boolean
  // default 60s
  cacheTtl?: number
}

export function withRSS(xmlDocHandler: (xmlDoc: any, context: ControllerContext) => Promise<Record<string, any>>, options?: WithRSSOptions) {
  return controller(async (context) => {
    const { req, env, ctx } = context
    const { CACHE = '1' } = env
    const { useCache = CACHE === '1', cacheTtl = 60 } = options || {}
    const { url } = req?.query || {}
    if (typeof url !== 'string') {
      throw new Error('url is required')
    }

    const cacheKey = new Request(req.url, req)
    const cacheKeyString = cacheKey.url
    const cache = caches.default

    if (useCache) {
      info(`Checking cache for key: ${cacheKeyString}`)

      const response = await cache.match(cacheKey)
      if (response) {
        info(`Cache hit for key: ${cacheKeyString}`)

        const clonedResponse = response.clone()
        const newHeaders = new Headers(clonedResponse.headers)
        newHeaders.append('hit-cache', cacheKeyString)

        return new Response(clonedResponse.body, {
          status: clonedResponse.status,
          statusText: clonedResponse.statusText,
          headers: newHeaders,
        })
      }
    }

    info(`Cache miss for key: ${cacheKeyString}`)
    const response = await fetch(url, {
      method: 'GET',
      headers: RSSHeaders,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()
    const parser = new XMLParser()
    const xmlDoc = parser.parse(xmlText)
    const json = await xmlDocHandler(xmlDoc, context)
    const jsonText = JSON.stringify(json)
    const responseToCache = new Response(jsonText, {
      headers: {
        ...FeedHeaders,
        'Cache-Control': `s-maxage=${cacheTtl}`,
      },
    })

    info(`Caching response for key: ${cacheKeyString}`)
    ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()))
    return responseToCache
  })
}
