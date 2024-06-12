"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Loading from "@vardast/component/Loading"
import { useSession } from "next-auth/react"

const Template = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== "loading" && !session?.accessToken) {
      router.push("/auth/signin/profile")
    }
  }, [session, status, router])

  if (session?.accessToken) {
    return <>{children}</>
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loading message="لطفا منتظر بمانید..." />
    </div>
  )
}

export default Template
