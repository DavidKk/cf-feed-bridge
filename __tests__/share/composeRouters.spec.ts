import type { RouterType } from 'itty-router'
import type { RouteHandler } from '@/share/composeRouters'
import { composeRouters } from '@/share/composeRouters'

describe('composeRouters', () => {
  let mockRouter: RouterType

  beforeEach(() => {
    mockRouter = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      all: jest.fn(),
    } as unknown as RouterType
  })

  it('should call all provided handlers with the router instance', () => {
    const handler1: RouteHandler = jest.fn()
    const handler2: RouteHandler = jest.fn()
    const handler3: RouteHandler = jest.fn()

    const composedHandler = composeRouters(handler1, handler2, handler3)
    composedHandler(mockRouter)

    expect(handler1).toHaveBeenCalledWith(mockRouter)
    expect(handler2).toHaveBeenCalledWith(mockRouter)
    expect(handler3).toHaveBeenCalledWith(mockRouter)
  })

  it('should handle an empty array of handlers', () => {
    const composedHandler = composeRouters()
    expect(() => composedHandler(mockRouter)).not.toThrow()
  })

  it('should call handlers in the correct order', () => {
    const handlerOrder: string[] = []
    const handler1: RouteHandler = jest.fn(() => handlerOrder.push('handler1'))
    const handler2: RouteHandler = jest.fn(() => handlerOrder.push('handler2'))
    const handler3: RouteHandler = jest.fn(() => handlerOrder.push('handler3'))

    const composedHandler = composeRouters(handler1, handler2, handler3)
    composedHandler(mockRouter)

    expect(handlerOrder).toEqual(['handler1', 'handler2', 'handler3'])
  })
})
