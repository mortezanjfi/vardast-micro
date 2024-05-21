import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { SearchActionModal } from "@vardast/component/Search"
import { getServerSession } from "next-auth"
import { signOut } from "next-auth/react"

// import { signOut } from "next-auth/react"

import AdminDesktopFooter from "@/app/(admin)/components/AdminDesktopFooter"
import AdminDesktopHeader from "@/app/(admin)/components/AdminDesktopHeader"
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

  return (
    <>
      <SearchActionModal isMobileView={false} />
      <AdminDesktopHeader />
      <div className="h-[92px] w-full bg-transparent"></div>
      <AdminLayoutComponent>
        {" "}
        <MobileBaseLayout bgWhite={false} container spaceLess>
          {children}
        </MobileBaseLayout>
      </AdminLayoutComponent>
      <AdminDesktopFooter />
    </>
  )
}
