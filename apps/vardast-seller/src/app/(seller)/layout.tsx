// import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import AdminOrSellerDesktopHeader from "@vardast/component/desktop/AdminOrSellerDesktopHeader"
import WithSidebarLayout from "@vardast/component/desktop/WithSidebarLayout"
// import { authOptions } from "@vardast/auth/authOptions"
import MobileScrollProvider from "@vardast/component/header/MobileScrollProvider"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { SearchActionModal } from "@vardast/component/Search"
import { _sellerSidebarMenu } from "@vardast/lib/constants"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isMobileView = await CheckIsMobileView()

  const session = await getServerSession(authOptions)

  if (
    !session?.accessToken ||
    (session?.accessToken &&
      !session?.profile?.roles.some((role) => role?.name === "seller"))
  ) {
    redirect("/auth/signin")
  }

  return (
    <>
      <SearchActionModal isMobileView={isMobileView} />
      {isMobileView ? (
        <MobileScrollProvider>{children}</MobileScrollProvider>
      ) : (
        <>
          <AdminOrSellerDesktopHeader />
          <div className="h-[92px] w-full bg-transparent"></div>
          <WithSidebarLayout menu={_sellerSidebarMenu}>
            <MobileBaseLayout bgWhite={false} container spaceLess>
              {children}
            </MobileBaseLayout>
          </WithSidebarLayout>
          {/* <AdminOrSellerDesktopFooter isAdmin={false} /> */}
        </>
      )}
    </>
  )
}
