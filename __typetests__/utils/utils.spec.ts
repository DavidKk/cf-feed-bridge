import { expectType } from 'tsd-lite'
import type { StringKeys, TrimPromise, Join, Paths, SplitPaths, Get } from '@/types/utils'

describe('types/utils', () => {
  describe('test StringKeys', () => {
    type TestType = {
      a: string
      b: number
      1: string
      [Symbol.iterator]: (...args: any[]) => any
    }

    type StringKeyResult = StringKeys<keyof TestType>

    it('should return string keys', () => {
      expectType<StringKeyResult>(((): 'a' | 'b' => 'a')())
    })
  })

  describe('test TrimPromise', () => {
    type TestType = Promise<123>
    type TrimPromiseResult = TrimPromise<TestType>

    it('should trim Promise', () => {
      expectType<TrimPromiseResult>(123)
    })
  })

  describe('test Join', () => {
    type JoinResult = Join<'a', 'b'>

    it('should join strings', () => {
      expectType<JoinResult>('a.b')
    })
  })

  describe('test Paths', () => {
    type TestType = {
      a: {
        b: {
          c: string
        }
      }
    }

    type PathsResult = Paths<TestType>

    it('should get paths of object', () => {
      expectType<PathsResult>(((): 'a' | 'a.b' | 'a.b.c' => 'a')())
    })
  })

  describe('test SplitPaths', () => {
    type SplitPathsResult = SplitPaths<'a.b.c'>

    it('should split paths', () => {
      expectType<SplitPathsResult>(((): 'a' | 'b' => 'a')())
    })
  })

  describe('test Get', () => {
    type TestType = {
      a: {
        b: {
          c: 123
        }
      }
    }

    type GetResult = Get<TestType, 'a.b.c'>

    it('should get value by path', () => {
      expectType<GetResult>(123)
    })
  })
})
