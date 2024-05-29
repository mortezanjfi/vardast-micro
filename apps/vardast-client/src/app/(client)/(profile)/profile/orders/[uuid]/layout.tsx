import { PropsWithChildren } from "react"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OfferItemStepper from "@/app/(client)/(profile)/profile/orders/[uuid]/components/OfferItemStepper"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <div className="flex flex-col gap-8">
      {!isMobileView && <OfferItemStepper />}
      <div>{children}</div>
    </div>
  )
}
export default Layout
