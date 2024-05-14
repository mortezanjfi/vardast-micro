import { PropsWithChildren } from "react"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()
  return (
    <MobileBaseLayout
      isMobileView={isMobileView}
      container={false}
      gap={!!isMobileView}
      spaceLess
    >
      {children}
    </MobileBaseLayout>
  )
}
export default Layout
