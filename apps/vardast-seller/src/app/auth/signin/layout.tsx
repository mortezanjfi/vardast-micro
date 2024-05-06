import { PropsWithChildren } from "react"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MobileBaseLayout from "@/app/components/MobileBaseLayout"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <MobileBaseLayout
      extraPadding={!isMobileView}
      background={!isMobileView}
      fullHeight={isMobileView}
      bgWhite={isMobileView}
    >
      {children}
    </MobileBaseLayout>
  )
}
export default Layout
