// import { redirect } from "next/navigation"
// import { getServerSession } from "next-auth"

// import { authOptions } from "@vardast/auth/authOptions"
import PublicProvider from "@vardast/provider/PublicProvider"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import SellerContactModal from "@/app/(client)/product/components/seller-contact-modal"

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <PublicProvider isMobileView={isMobileView}>
      <SellerContactModal />
      {children}
    </PublicProvider>
  )
}

export default PublicLayout
