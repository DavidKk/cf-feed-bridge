import type { IContext } from '@/initializer'
import { info, fail } from '@/services/logger'
import { request } from '@/services/request'
import { TOKEN_EXPIRATION_TIME, TVDB_API_BASE_URL } from './conf'

export interface AccessTokenResp {
  data: {
    token: string
  }
}

let cachedToken: string | null = null
let tokenExpirationTime = 0
let tokenPromise: Promise<ResponseLike> | null = null

/**
 * Retrieves the access token for TVDB API.
 *
 * @param context - The context object containing environment variables.
 * @returns A promise that resolves to the access token.
 */
export async function getAccessToken(context: IContext): Promise<string> {
  const now = Date.now()
  // Check if there is a cached token and if it has not expired
  if (cachedToken && now < tokenExpirationTime) {
    info('Cache hit: Using cached access token')
    return cachedToken
  }

  // If there is no ongoing token request, initiate a new one
  if (!tokenPromise) {
    info('Cache miss: Fetching new access token')

    const { env } = context
    const { THE_TVDB_API_KEY } = env
    if (typeof THE_TVDB_API_KEY !== 'string') {
      throw new Error('Missing THE_TVDB_API_KEY, please check vars.THE_TVDB_API_KEY.')
    }

    const body = JSON.stringify({
      apikey: THE_TVDB_API_KEY,
    })

    tokenPromise = request('POST', `${TVDB_API_BASE_URL}/login`, { method: 'POST', body })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch access token: ${response.statusText}`)
        }

        try {
          const json = await response.json<AccessTokenResp>()
          cachedToken = json.data.token
          tokenExpirationTime = now + TOKEN_EXPIRATION_TIME

          info(`TVDB access token is ${cachedToken}`)

          return cachedToken
        } catch (jsonError) {
          const text = await response.text()
          fail(`Failed to parse JSON, response text: ${text}`)
          throw new Error(`Failed to parse JSON: ${jsonError}`)
        }
      })
      .finally(() => {
        tokenPromise = null
      })

    return tokenPromise
  }

  info('Using existing token request promise')
  return tokenPromise
}
