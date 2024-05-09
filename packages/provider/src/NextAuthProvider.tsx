"use client"

import { SessionProvider } from "next-auth/react"

type Props = {
  children: React.ReactNode
}

export default function NextAuthProvider({ children }: Props) {
  return (
    <SessionProvider
      basePath={`${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}/api/auth`}
    >
      {children}
    </SessionProvider>
  )
}
