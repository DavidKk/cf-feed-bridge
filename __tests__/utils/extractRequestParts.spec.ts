import { extractRequestParts, BODY_PREFIX, HEADER_PREFIX, QUERY_PREFIX, type RequestParts } from '@/utils/extractRequestParts'

describe('extractRequestParts function', () => {
  let parts: RequestParts

  beforeEach(() => {
    parts = {
      path: '/test',
      query: {
        a: {
          b: 'value-from-query',
          title: 'value-from-title',
        },
      },
      headers: new Headers({
        'X-Custom-Header': 'value-from-header',
      }),
      body: {
        a: {
          b: 'value-from-body',
          title: 'value-from-body-title',
        },
      },
    }
  })

  it('should extractRequestParts value from body', () => {
    const result = extractRequestParts(`${BODY_PREFIX}a.b`, parts)
    expect(result).toBe('value-from-body')
  })

  it('should extractRequestParts value from query', () => {
    const result = extractRequestParts(`${QUERY_PREFIX}a.b`, parts)
    expect(result).toBe('value-from-query')
  })

  it('should extractRequestParts value from headers', () => {
    const result = extractRequestParts(`${HEADER_PREFIX}X-Custom-Header`, parts)
    expect(result).toBe('value-from-header')
  })

  it('should return undefined for unmatched pattern', () => {
    const result = extractRequestParts('unknown.prefix.a.b', parts)
    expect(result).toBeUndefined()
  })

  it('should return undefined for non-existent path', () => {
    const result = extractRequestParts(`${BODY_PREFIX}a.nonexistent`, parts)
    expect(result).toBeUndefined()
  })

  it('should handle empty body, query, and headers', () => {
    const emptyParts: RequestParts = {
      path: '',
      query: {},
      headers: new Headers(),
      body: {},
    }

    const resultBody = extractRequestParts(`${BODY_PREFIX}a.b`, emptyParts)
    const resultQuery = extractRequestParts(`${QUERY_PREFIX}a.b`, emptyParts)
    const resultHeader = extractRequestParts(`${HEADER_PREFIX}X-Custom-Header`, emptyParts)

    expect(resultBody).toBeUndefined()
    expect(resultQuery).toBeUndefined()
    expect(resultHeader).toBeUndefined()
  })

  it('should handle circular references', () => {
    // Circular reference setup
    parts.body.a.c = `${BODY_PREFIX}a.c`
    parts.query.d = `${QUERY_PREFIX}d`
    parts.query.d = parts.query.d

    const resultCircularBody = extractRequestParts(`${BODY_PREFIX}a.c`, parts)
    const resultCircularQuery = extractRequestParts(`${QUERY_PREFIX}d`, parts)

    expect(resultCircularBody).toBeUndefined()
    expect(resultCircularQuery).toBeUndefined()
  })
})
