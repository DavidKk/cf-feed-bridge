import type { IContext } from '../../initializer/types'
import { info, fail } from '../../utils/logger'
import { TOKEN_EXPIRATION_TIME, TVDB_API_BASE_URL } from './conf'

export interface AccessTokenResp {
  data: {
    token: string
  }
}

let cachedToken: string | null = null
let tokenExpirationTime = 0
let tokenPromise: Promise<string> | null = null

export async function getAccessToken(context: IContext): Promise<string> {
  const now = Date.now()

  if (cachedToken && now < tokenExpirationTime) {
    info('Cache hit: Using cached access token')
    return cachedToken
  }

  if (!tokenPromise) {
    info('Cache miss: Fetching new access token')

    const { env } = context
    const { THE_TVDB_API_KEY } = env
    const body = JSON.stringify({
      apikey: THE_TVDB_API_KEY,
    })

    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
    }

    tokenPromise = fetch(`${TVDB_API_BASE_URL}/login`, { method: 'POST', headers, body })
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
      .catch((err) => {
        fail(`Error fetching access token: ${err}`)
        throw err
      })
      .finally(() => {
        tokenPromise = null
      })
  } else {
    info('Using existing token request promise')
  }

  return tokenPromise
}
