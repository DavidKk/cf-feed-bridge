import { createResponse } from '@/share/createResponse'
import type { ControllerContext } from './controller'
import { controller } from './controller'

export type JsonHandler = (ctx: ControllerContext) => any | Promise<any>

export function json(handler: JsonHandler) {
  return controller(async (ctx) => {
    try {
      const data = await handler(ctx)
      return createResponse(data)
    } catch (error) {
      return createResponse(error)
    }
  })
}
