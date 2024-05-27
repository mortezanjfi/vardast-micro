import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import AdminOrSellerDesktopFooter from "@vardast/component/desktop/AdminOrSellerDesktopFooter"
import AdminOrSellerDesktopHeader from "@vardast/component/desktop/AdminOrSellerDesktopHeader"
import AdminOrSellerLayoutComponent from "@vardast/component/desktop/AdminOrSellerLayout"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { SearchActionModal } from "@vardast/component/Search"
import { _sidebarMenu } from "@vardast/lib/constants"
import { getServerSession } from "next-auth"

// import { signOut } from "next-auth/react"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (
    !session.accessToken ||
    (session.accessToken &&
      !session?.profile?.roles.some((role) => role?.name === "admin"))
  ) {
    redirect("/auth/signin")
  }

  // if (session.error === "RefreshAccessTokenError") {
  //   signOut({
  //     callbackUrl: "/"
  //   })
  // }

  return (
    <>
      <SearchActionModal isMobileView={false} />
      <AdminOrSellerDesktopHeader />
      <div className="h-[92px] w-full bg-transparent"></div>
      <AdminOrSellerLayoutComponent menu={_sidebarMenu}>
        {" "}
        <MobileBaseLayout bgWhite={false} container spaceLess>
          {children}
        </MobileBaseLayout>
      </AdminOrSellerLayoutComponent>
      <AdminOrSellerDesktopFooter isAdmin={true} />
    </>
  )
}
