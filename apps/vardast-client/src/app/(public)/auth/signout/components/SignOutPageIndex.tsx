"use client"

import { useEffect } from "react"
import Loading from "@vardast/component/Loading"
import { signOut } from "next-auth/react"

export default function SignOutPageIndex() {
  useEffect(() => {
    signOut({
      callbackUrl: "/"
    })
  }, [])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loading message="لطفا منتظر بمانید..." />
    </div>
  )
}
