import type { IRequest } from 'itty-router'
import { XMLParser } from 'fast-xml-parser'
import { RSSHeaders, FeedHeaders } from '../constants/header'

export function withRSS(xmlDocHandler: (xmlDoc: any) => Promise<Record<string, any>>) {
  return async function handler(request: IRequest) {
    const { url } = request?.query || {}
    if (typeof url !== 'string') {
      throw new Error('url is required')
    }

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
    const json = await xmlDocHandler(xmlDoc)
    const jsonText = JSON.stringify(json)

    return new Response(jsonText, {
      headers: FeedHeaders,
    })
  }
}
