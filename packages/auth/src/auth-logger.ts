export default function AuthLogger() {
  return {
    error(message: string, ...extra: any[]) {
      console.error(message, ...extra)
    },
    warn: console.warn,
    info: console.info,
    debug: console.debug
  }
}
