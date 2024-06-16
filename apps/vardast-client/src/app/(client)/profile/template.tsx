"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import paths from "@vardast/lib/paths"
import { usePageLoading } from "@vardast/provider/LayoutProvider/use-layout"
import { useSession } from "next-auth/react"

const Template = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [_, setLoading] = usePageLoading()

  useEffect(() => {
    setLoading(true)
    if (status !== "loading") {
      if (!session?.accessToken) {
        return router.push(`${paths.signin}?ru=/profile`)
      }
      setLoading(false)
    }
  }, [session, status, router, pathname])

  return <>{children}</>
}

export default Template
