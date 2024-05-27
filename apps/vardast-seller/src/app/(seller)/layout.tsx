// import { getServerSession } from "next-auth"
import { authOptions } from "@vardast/auth/authOptions"
import AdminOrSellerDesktopHeader from "@vardast/component/desktop/AdminOrSellerDesktopHeader"
import AdminOrSellerLayoutComponent from "@vardast/component/desktop/AdminOrSellerLayout"
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
    !!session &&
    !!session?.profile?.roles.some((role) => role?.name === "seller")
  ) {
    return (
      <>
        <SearchActionModal isMobileView={isMobileView} />
        {isMobileView ? (
          <MobileScrollProvider>{children}</MobileScrollProvider>
        ) : (
          <>
            <AdminOrSellerDesktopHeader />
            <div className="h-[92px] w-full bg-transparent"></div>
            <AdminOrSellerLayoutComponent menu={_sellerSidebarMenu}>
              {" "}
              <MobileBaseLayout bgWhite={false} container spaceLess>
                {children}
              </MobileBaseLayout>
            </AdminOrSellerLayoutComponent>
            {/* <AdminOrSellerDesktopFooter isAdmin={false} /> */}
          </>
        )}
      </>
    )
  }
}
