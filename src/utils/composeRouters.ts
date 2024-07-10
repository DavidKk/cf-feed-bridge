import type { RouterInstance } from '../types/router'

export interface RouteHandler {
  (router: RouterInstance): void
}

export function composeRouters(...handlers: RouteHandler[]): RouteHandler {
  return (instance: RouterInstance) => {
    for (const func of handlers) {
      func(instance)
    }
  }
}
