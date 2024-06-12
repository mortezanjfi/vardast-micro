import { signOut } from "next-auth/react"

export const clearCookies = () => {
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = `${name}= {};path=/`
  }
}

export const clearStorage = () => {
  sessionStorage.clear()
}

export const clearCacheBySignOut = async (callbackUrl?: string) => {
  await signOut({ callbackUrl: callbackUrl || "/" })
  clearCookies()
  clearStorage()
}
