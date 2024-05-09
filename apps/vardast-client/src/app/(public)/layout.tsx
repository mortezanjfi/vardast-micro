// import { redirect } from "next/navigation"
// import { getServerSession } from "next-auth"

import DesktopFooter from "@vardast/component/desktop/DesktopFooter"
import DesktopHeader from "@vardast/component/desktop/DesktopHeader"
import { SearchActionModal } from "@vardast/component/search"
import PublicProvider from "@vardast/provider/PublicProvider"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import SellerContactModal from "@/app/(public)/(purchaser)/product/components/seller-contact-modal"

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isMobileView = await CheckIsMobileView()

  return (
    <PublicProvider isMobileView={isMobileView}>
      <SearchActionModal isMobileView={isMobileView} />
      <SellerContactModal />
      {isMobileView ? (
        children
      ) : (
        <>
          {process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "user" && (
            <DesktopHeader />
          )}
          <div className="h-[92px] w-full bg-transparent"></div>
          <div className="flex flex-col">{children}</div>
          {process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "user" && (
            <DesktopFooter />
          )}
        </>
      )}
    </PublicProvider>
  )
}
