import { RouterType } from "itty-router"

export interface RouteHandler {
  (router: RouterType): void
}

export function composeRouters(...handlers: RouteHandler[]): RouteHandler {
  return (instance: RouterType) => {
    for (const func of handlers) {
      func(instance)
    }
  }
}
