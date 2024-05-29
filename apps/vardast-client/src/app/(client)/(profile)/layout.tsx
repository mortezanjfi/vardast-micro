import { PropsWithChildren } from "react"
import WithSidebarLayout from "@vardast/component/desktop/WithSidebarLayout"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { _profileSidebarMenu } from "@vardast/lib/constants"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()
  return (
    <WithSidebarLayout
      grayBackground={false}
      menu={_profileSidebarMenu}
      isMobileView={isMobileView}
    >
      <MobileBaseLayout
        isMobileView={isMobileView}
        bgWhite={true}
        container={true}
        spaceLess
      >
        {children}
      </MobileBaseLayout>
    </WithSidebarLayout>
  )
}
export default Layout
