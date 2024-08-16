import type { IContext } from '@/initializer'
import { fail, info } from '@/services/logger'
import { request } from '@/services/request'
import { TVDB_API_BASE_URL } from './conf'
import { getAccessToken } from './getAccessToken'
import type { Movie } from './types'

export interface SearchResponse {
  status: string
  data: Movie[]
}

export async function searchByTitle(context: IContext, title: string) {
  const { env } = context
  const { THE_TVDB_API_KEY } = env
  if (typeof THE_TVDB_API_KEY !== 'string') {
    throw new Error('Missing THE_TVDB_API_KEY, please check vars.THE_TVDB_API_KEY.')
  }

  const accessToken = await getAccessToken(context)
  const apiUrl = `${TVDB_API_BASE_URL}/search?query=${encodeURIComponent(title)}`
  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  })

  try {
    info(`Fetching data from TVDB for title: ${title}`)
    const response = await request('GET', apiUrl, { headers })
    if (!response.ok) {
      fail(`Error fetching data from TVDB for title: ${title}, status: ${response.status}, statusText: ${response.statusText}`)
      return null
    }

    const resp = await response.json<SearchResponse>()
    if (resp.status !== 'success') {
      fail(`Successfully fetched data from TVDB for title:`, resp)
      return null
    }

    info(`Successfully fetched data from TVDB for title: ${title}`)
    return resp.data
  } catch (error) {
    fail(`Error fetching data from TVDB for title: ${title}, error: ${error}`)
    return null
  }
}
