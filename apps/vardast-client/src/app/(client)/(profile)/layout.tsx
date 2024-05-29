import { PropsWithChildren } from "react"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import WithSidebarLayout from "@/app/(client)/(profile)/components/UserProfileLayout"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()
  return (
    <WithSidebarLayout isMobileView={isMobileView}>
      <MobileBaseLayout bgWhite={true} container={true} spaceLess>
        {children}
      </MobileBaseLayout>
    </WithSidebarLayout>
  )
}
export default Layout
