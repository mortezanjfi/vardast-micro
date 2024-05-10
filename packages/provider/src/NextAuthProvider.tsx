"use client"

import { SessionProvider } from "next-auth/react"

type Props = {
  children: React.ReactNode
  basePath: string
}

export default function NextAuthProvider({ basePath, children }: Props) {
  return <SessionProvider basePath={basePath}>{children}</SessionProvider>
}
