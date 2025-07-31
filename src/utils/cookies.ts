export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(
    new RegExp('(^|;\\s*)' + name.replace(/[-.+*]/g, '\\$&') + '=([^;]*)')
  )
  return match ? decodeURIComponent(match[2]) : undefined
}
