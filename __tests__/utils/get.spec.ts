import { get } from '@/utils/get' // 替换为实际路径

describe('get', () => {
  const sampleObject = {
    a: {
      b: {
        c: 'value',
        d: 42,
        e: null,
        f: {
          g: 'nested value',
        },
      },
    },
    x: 100,
    y: [10, 20, 30],
    z: 'string value',
  }

  it('should get the value at a given path', () => {
    expect(get(sampleObject, 'a.b.c')).toBe('value')
    expect(get(sampleObject, 'a.b.d')).toBe(42)
    expect(get(sampleObject, 'a.b.f.g')).toBe('nested value')
  })

  it('should return undefined for nonexistent paths', () => {
    expect(get(sampleObject, 'a.b.h')).toBeUndefined()
    expect(get(sampleObject, 'a.b.f.h')).toBeUndefined()
    expect(get(sampleObject, 'nonexistent.path')).toBeUndefined()
  })

  it('should return the default value for nonexistent paths if provided', () => {
    expect(get(sampleObject, 'a.b.h', 'default')).toBe('default')
    expect(get(sampleObject, 'a.b.f.h', 123)).toBe(123)
    expect(get(sampleObject, 'nonexistent.path', null)).toBeNull()
  })

  it('should handle arrays in the path', () => {
    expect(get(sampleObject, 'y.0')).toBe(10)
    expect(get(sampleObject, 'y.2')).toBe(30)
    expect(get(sampleObject, 'y.3')).toBeUndefined()
  })

  it('should return undefined when path is an empty string', () => {
    expect(get(sampleObject, '')).toBeUndefined()
  })

  it('should handle null or undefined values in the object', () => {
    expect(get(sampleObject, 'a.b.e')).toBeNull()
    expect(get(sampleObject, 'a.b.f.g.h', 'default')).toBe('default')
  })

  it('should throw an error if the path is not a string', () => {
    // @ts-expect-error: testing runtime error for invalid input
    expect(() => get(sampleObject, null)).toThrow('Path must be a string')
    // @ts-expect-error: testing runtime error for invalid input
    expect(() => get(sampleObject, undefined)).toThrow('Path must be a string')
    // @ts-expect-error: testing runtime error for invalid input
    expect(() => get(sampleObject, {})).toThrow('Path must be a string')
  })
})
