import type { Get } from '@/types/utils'

export function get<T, P extends string>(target: T, path: P, defaultValue?: any): Get<T, P> {
  if (typeof path !== 'string') {
    throw new Error('Path must be a string')
  }

  const ns = path.split('.')
  return ns.reduce((acc: any, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key]
    }

    return defaultValue
  }, target)
}
