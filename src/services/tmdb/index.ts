import type { IContext } from '../../initializer/types'
import type { SearchResult } from './types'
import { fail, info, warn } from '../../utils/logger'
import { TVDB_API_BASE_URL } from './conf'

export interface SearchResponse {
  page: number
  results: SearchResult[]
  total_pages: number
  total_results: number
}

export async function searchTVShowByTitle(context: IContext, title: string) {
  const { env } = context
  const { TMDB_API_KEY } = env
  if (typeof TMDB_API_KEY !== 'string') {
    throw new Error('Missing TMDB_API_KEY, please check vars.TMDB_API_KEY.')
  }

  const apiUrl = `${TVDB_API_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
  const headers = new Headers({ Accept: 'application/json' })

  try {
    info(`Fetching data from TVDB for TV show title: ${title}`)
    const response = await fetch(apiUrl, { headers })
    if (!response.ok) {
      fail(`Error fetching data from TVDB for TV show title: ${title}, status: ${response.status}, statusText: ${response.statusText}`)
      return null
    }

    const resp = await response.json<SearchResponse>()
    if (!(Array.isArray(resp.results) && resp.results.length > 0)) {
      warn('No results found.')
      return []
    }

    info(`Successfully fetched data from TVDB for TV show title: ${title}`)
    return resp.results
  } catch (error) {
    fail(`Error fetching data from TVDB for TV show title: ${title}, error: ${error}`)
    return null
  }
}
