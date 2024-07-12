import { debug, fail } from './logger'

const TIMEOUT_SECONDS = 30e3 // Default timeout in milliseconds

/**
 * Extended request initialization options.
 * @interface IRequestInit
 * @extends {RequestInit<RequestInitCfProperties>}
 */
export interface IRequestInit extends RequestInit<RequestInitCfProperties> {
  timeout?: number // Optional timeout in milliseconds
}

/**
 * Sends a HTTP request with the specified method, input, and optional initialization options.
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
 * @param {RequestInfo} input - The request URL or a Request object.
 * @param {IRequestInit} [init] - Optional initialization options for the request.
 * @returns {Promise<Response>} - A promise that resolves to the response.
 */
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

  const timeoutPromise = new Promise<Response>((_, reject) => {
    setTimeout(() => {
      controller.abort()
      reject(new Error('Request timed out after 5 seconds'))
    }, timeout)
  })

  return Promise.race([requestPromise, timeoutPromise])
}
