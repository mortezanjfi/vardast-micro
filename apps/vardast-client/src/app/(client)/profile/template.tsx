"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { usePageLoading } from "@vardast/provider/LayoutProvider/use-layout"
import { useSession } from "next-auth/react"

const Template = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [_, setLoading] = usePageLoading()
  const [_force, setForceRender] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (status !== "loading") {
      setLoading(false)
    }
    if (pathname === "/profile") {
      setForceRender((prev) => !prev)
    }
  }, [session, status, router, pathname])

  return <>{children}</>
}

export default Template
