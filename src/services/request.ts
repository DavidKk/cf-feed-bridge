import { debug, fail } from './logger'

const TIMEOUT_SECONDS = 30e3

export interface IRequestInit extends RequestInit<RequestInitCfProperties> {
  timeout?: number
}

export function request(method: string, input: RequestInfo, init?: IRequestInit): Promise<Response> {
  const { signal, timeout = TIMEOUT_SECONDS } = init || {}
  const controller = new AbortController()
  const absortSignal = signal || controller.signal
  const headers = new Headers({
    accept: 'application/json',
    'Content-Type': 'application/json',
    ...init?.headers,
  })

  const initOptions = { method, headers, ...init, signal: absortSignal }

  // Log the curl command for debugging purposes
  const paramH = Array.from(headers.entries()).map(([name, value]) => `  -H "${name}:${value}"`)
  const command = [`curl -X ${method} "${input}"`, ...paramH].join(' \\\n')
  debug(`Executing request: \n${command}`)

  const requestPromise = fetch(input, initOptions).catch((err) => {
    if (err.name === 'AbortError') {
      fail('Fetch request aborted')
    } else {
      fail(`Error fetching access token: ${err}`)
    }

    throw err
  })

  const timeoutPromise = new Promise<ResponseLike>((_, reject) => {
    setTimeout(() => {
      const TIMEOUT_MESSAGE = `Request timed out after ${timeout / 1e3} seconds`
      fail(TIMEOUT_MESSAGE)
      controller.abort()
      reject(new Error(TIMEOUT_MESSAGE))
    }, timeout)
  })

  return Promise.race([requestPromise, timeoutPromise])
}
