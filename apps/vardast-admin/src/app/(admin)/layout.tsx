import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"
import { signOut } from "next-auth/react"

// import { signOut } from "next-auth/react"

import AdminLayoutComponent from "@/app/(admin)/components/AdminLayout"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (
    !session ||
    (session && !session?.profile?.roles.some((role) => role?.name === "admin"))
  ) {
    redirect("/auth/signin")
  }

  if (session.error === "RefreshAccessTokenError") {
    signOut({
      callbackUrl: "/"
    })
  }

  return <AdminLayoutComponent>{children}</AdminLayoutComponent>
}
