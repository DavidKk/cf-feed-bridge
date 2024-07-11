import type { IRequest } from 'itty-router'
import type { Handler, TrimHandler, HandlerParameters, HandlerReturn, IContext } from './types'

export interface ControllerContext extends IContext {
  use<T extends Handler>(handler: T): TrimHandler<T>
}

export type ControllerHandler = (ctx: ControllerContext) => Response | Promise<Response>

export class Context {
  public readonly req: IRequest
  public readonly env: Env
  public readonly ctx: ExecutionContext

  constructor(req: IRequest, env: Env, ctx: ExecutionContext) {
    this.req = req
    this.env = env
    this.ctx = ctx
  }

  public get context() {
    return {
      req: this.req,
      env: this.env,
      ctx: this.ctx,
    }
  }

  public get source() {
    const use = this.use.bind(this)
    return { use, ...this.context }
  }

  public use<T extends Handler>(handler: T) {
    const context = this
    return function (this: any, ...args: HandlerParameters<T>): HandlerReturn<T> {
      return handler.call(this, context, ...args)
    }
  }
}

export function controller(handler: ControllerHandler) {
  return (req: IRequest, env: Env, ctx: ExecutionContext) => {
    const context = new Context(req, env, ctx)
    return handler(context.source)
  }
}
