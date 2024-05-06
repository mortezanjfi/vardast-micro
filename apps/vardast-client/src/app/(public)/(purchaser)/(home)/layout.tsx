import { PropsWithChildren } from "react"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MobileBaseLayout from "@/app/components/MobileBaseLayout"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()
  return (
    <MobileBaseLayout container={false} gap={!!isMobileView} spaceLess>
      {children}
    </MobileBaseLayout>
  )
}
export default Layout
