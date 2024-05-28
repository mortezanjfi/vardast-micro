import { PropsWithChildren } from "react"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import UserProfileLayout from "@/app/(client)/(profile)/components/UserProfileLayout"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()
  return (
    <UserProfileLayout isMobileView={isMobileView}>
      <MobileBaseLayout
        isMobileView={isMobileView}
        bgWhite={true}
        container={false}
        spaceLess
      >
        {children}
      </MobileBaseLayout>
    </UserProfileLayout>
  )
}
export default Layout
