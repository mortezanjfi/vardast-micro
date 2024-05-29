import { PropsWithChildren } from "react"
import WithSidebarLayout from "@vardast/component/desktop/WithSidebarLayout"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { _clientSidebarMenu } from "@vardast/lib/constants"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()
  return (
    <WithSidebarLayout
      isUserProfile={true}
      grayBackground={false}
      menu={_clientSidebarMenu}
      isMobileView={isMobileView}
    >
      <MobileBaseLayout bgWhite={true} container={true} spaceLess>
        {children}
      </MobileBaseLayout>
    </WithSidebarLayout>
  )
}
export default Layout
