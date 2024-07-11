export function info(...messages: any[]) {
  // eslint-disable-next-line no-console
  console.log('[INFO]', ...messages)
}

export function warn(...messages: any[]) {
  // eslint-disable-next-line no-console
  console.log('[WARN]', ...messages)
}

export function fail(...messages: any[]) {
  // eslint-disable-next-line no-console
  console.log('[FAIL]', ...messages)
}
