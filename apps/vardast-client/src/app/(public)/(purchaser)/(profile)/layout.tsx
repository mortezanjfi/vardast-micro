import { PropsWithChildren } from "react"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <MobileBaseLayout extraPadding background bgWhite={isMobileView}>
      {children}
    </MobileBaseLayout>
  )
}
export default Layout
