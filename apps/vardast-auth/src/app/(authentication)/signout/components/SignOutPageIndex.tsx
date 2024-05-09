"use client"

import { useEffect } from "react"
import Loading from "@vardast/component/Loading"
import { signOut } from "next-auth/react"

export default function SignOutPageIndex() {
  useEffect(() => {
    signOut({
      callbackUrl: `${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/`
    })
  }, [])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loading message="لطفا منتظر بمانید..." />
    </div>
  )
}
