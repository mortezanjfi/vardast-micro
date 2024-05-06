import { PropsWithChildren } from "react"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MobileBaseLayout from "@/app/components/MobileBaseLayout"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <MobileBaseLayout extraPadding background bgWhite={isMobileView}>
      {children}
    </MobileBaseLayout>
  )
}
export default Layout
