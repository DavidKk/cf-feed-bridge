import type { IRequest } from 'itty-router'
import { XMLParser } from 'fast-xml-parser'
import { RSSHeaders, FeedHeaders } from '../constants/header'

export interface WithRSSOptions {
  // default 60s
  cacheTtl?: number
}

export function withRSS(xmlDocHandler: (xmlDoc: any) => Promise<Record<string, any>>, options?: WithRSSOptions) {
  return async function handler(req: IRequest, _env: Env, ctx: ExecutionContext) {
    const { cacheTtl = 60 } = options || {}
    const { url } = req?.query || {}
    if (typeof url !== 'string') {
      throw new Error('url is required')
    }

    const cacheKey = new Request(url, req)
    const cacheKeyString = cacheKey.url
    const cache = caches.default

    console.log(`Checking cache for key: ${cacheKeyString}`)
    let response = await cache.match(cacheKey)
    if (response) {
      console.log(`Cache hit for key: ${cacheKeyString}`)

      const clonedResponse = response.clone()
      const newHeaders = new Headers(clonedResponse.headers)
      newHeaders.append('hit-cache', cacheKeyString)

      return new Response(clonedResponse.body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: newHeaders,
      })
    }

    console.log(`Cache miss for key: ${cacheKeyString}`)
    response = await fetch(url, {
      method: 'GET',
      headers: RSSHeaders,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()
    const parser = new XMLParser()
    const xmlDoc = parser.parse(xmlText)
    const json = await xmlDocHandler(xmlDoc)
    const jsonText = JSON.stringify(json)

    const responseToCache = new Response(jsonText, {
      headers: {
        ...FeedHeaders,
        'Cache-Control': `s-maxage=${cacheTtl}`,
      },
    })

    console.log(`Caching response for key: ${cacheKeyString}`)
    ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()))
    return responseToCache
  }
}
