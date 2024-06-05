import { PropsWithChildren } from "react"

import OfferItemStepper from "@/app/(client)/profile/orders/[uuid]/components/OfferItemStepper"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  return (
    <div className="flex flex-col gap-8">
      <OfferItemStepper />
      <div>{children}</div>
    </div>
  )
}
export default Layout
