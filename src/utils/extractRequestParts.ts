import { get } from './get'

export const BODY_PREFIX = '$body.'
export const QUERY_PREFIX = '$query.'
export const HEADER_PREFIX = '$header.'

export interface RequestParts {
  path: string
  query: Record<string, any>
  headers: Headers
  body: any
}

/**
 * 检查模式是否以预定义的前缀开始
 * @param pattern - 需要检查的模式字符串
 * @returns 如果模式以 BODY_PREFIX、QUERY_PREFIX 或 HEADER_PREFIX 开头，则返回 true；否则返回 false
 */
export function matchRequestParts(pattern: string) {
  return pattern.startsWith(BODY_PREFIX) || pattern.startsWith(QUERY_PREFIX) || pattern.startsWith(HEADER_PREFIX)
}

/**
 * 从请求部件中提取匹配的值
 * @param pattern - 需要匹配的模式字符串
 * @param parts - 请求的各部分，包括路径、查询、头部和正文
 * @returns 匹配的值，如果模式不匹配任何部分或值无效，则返回 undefined
 */
export function extractRequestParts(pattern: string, parts: RequestParts): string | undefined {
  // 处理正文部分
  if (pattern.startsWith(BODY_PREFIX)) {
    const path = pattern.substring(BODY_PREFIX.length) // 去掉前缀
    const value = get(parts.body, path) // 从正文中获取值
    // 如果值是字符串并且匹配模式，则返回 undefined
    if (typeof value === 'string' && matchRequestParts(value)) {
      return
    }
    return value
  }

  // 处理查询参数部分
  if (pattern.startsWith(QUERY_PREFIX)) {
    const path = pattern.substring(QUERY_PREFIX.length) // 去掉前缀
    const value = get(parts.query, path) // 从查询参数中获取值
    // 如果值是字符串并且匹配模式，则返回 undefined
    if (typeof value === 'string' && matchRequestParts(value)) {
      return
    }
    return value
  }

  // 处理头部部分
  if (pattern.startsWith(HEADER_PREFIX)) {
    const path = pattern.substring(HEADER_PREFIX.length) // 去掉前缀
    const value = parts.headers.get(path) || undefined // 从头部中获取值
    // 如果值是字符串并且匹配模式，则返回 undefined
    if (typeof value === 'string' && matchRequestParts(value)) {
      return
    }
    return value
  }

  // 如果模式不匹配任何部分，返回 undefined
  return undefined
}
