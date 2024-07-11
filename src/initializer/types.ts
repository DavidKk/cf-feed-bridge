import type { IRequest } from 'itty-router'

export interface IContext {
  req: IRequest
  env: Env
  ctx: ExecutionContext
}

export type Handler = (context: IContext, ...args: any[]) => any
export type HandlerReturn<T> = T extends Handler ? ReturnType<T> : never
export type HandlerParameters<T> = T extends Handler ? (Parameters<T> extends [context: IContext, ...rest: infer A] ? A : never) : never
export type TrimHandler<T> = (...args: HandlerParameters<T>) => HandlerReturn<T>

export function isHandler(fn: any): fn is Handler {
  return typeof fn === 'function' && fn.length > 0
}
