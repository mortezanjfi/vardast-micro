// import { redirect } from "next/navigation"
// import { getServerSession } from "next-auth"

import PublicProvider from "@vardast/provider/PublicProvider"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

// import { authOptions } from "@vardast/auth/authOptions"
import SellerContactModal from "@/app/(public)/(purchaser)/product/components/seller-contact-modal"
import DesktopFooterV2 from "@/app/components/desktop/DesktopFooterV2"
import DesktopHeader from "@/app/components/desktop/DesktopHeader"
import { SearchActionModal } from "@/app/components/search"

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
        <div className="flex h-full flex-col overflow-y-scroll">
          {process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "user" && (
            <DesktopHeader />
          )}
          <div className="flex flex-col">{children}</div>
          {process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "user" && (
            <DesktopFooterV2 />
          )}
        </div>
      )}
    </PublicProvider>
  )
}
