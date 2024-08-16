import { request } from '@/services/request' // 替换为实际路径
import { debug, fail } from '@/services/logger' // 替换为实际路径

// 模拟 fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

declare let global: typeof globalThis & {
  AbortController: any
}

// 模拟 debug 和 fail
jest.mock('@/services/logger', () => ({
  debug: jest.fn(),
  fail: jest.fn(),
}))

// 创建一个自定义的 AbortController 模拟
class MockAbortController {
  signal = {}
  abort() {}
}

describe('request', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.AbortController = MockAbortController
  })

  it('should execute request and log the curl command', async () => {
    const mockResponse = { ok: true } as Response
    mockFetch.mockResolvedValue(mockResponse)

    await expect(request('GET', 'https://api.example.com')).resolves.toBe(mockResponse)
    expect(debug).toHaveBeenCalledWith(expect.stringContaining('Executing request:'))
  })

  it('should handle request timeout', async () => {
    const mockAbort = jest.fn()
    const mockAbortController = new MockAbortController()
    mockAbortController.abort = mockAbort
    global.AbortController = jest.fn(() => mockAbortController)

    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    const promise = request('GET', 'https://api.example.com', { timeout: 200 })
    await expect(promise).rejects.toThrow('Request timed out after')
    expect(mockAbort).toHaveBeenCalled()
    expect(fail).toHaveBeenCalledWith('Request timed out after 0.2 seconds')
  })

  it('should handle fetch errors', async () => {
    const mockError = new Error('Network error')
    mockFetch.mockRejectedValue(mockError)

    const promise = request('GET', 'https://api.example.com')
    await expect(promise).rejects.toThrow('Network error')
    expect(fail).toHaveBeenCalledWith('Error fetching access token: Error: Network error')
  })
})
