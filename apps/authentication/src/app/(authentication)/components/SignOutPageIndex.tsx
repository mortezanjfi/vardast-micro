"use client"

import { useEffect } from "react"
import Loading from "@vardast/component/Loading"
import { clearCacheBySignOut } from "@vardast/util/session"

export default function SignOutPageIndex() {
  useEffect(() => {
    try {
      clearCacheBySignOut("/")
    } catch (error) {
      console.error("Error during sign out:", error)
    }
  }, [])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loading message="لطفا منتظر بمانید..." />
    </div>
  )
}
