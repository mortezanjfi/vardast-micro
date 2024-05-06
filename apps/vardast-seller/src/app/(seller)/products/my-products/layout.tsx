import { PropsWithChildren } from "react"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MobileBaseLayout from "@/app/components/MobileBaseLayout"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = CheckIsMobileView()

  return (
    <>
      {isMobileView ? (
        <MobileBaseLayout
          extraPadding={!isMobileView}
          background={!isMobileView}
          bgWhite={isMobileView}
        >
          {children}
        </MobileBaseLayout>
      ) : (
        <>{children}</>
      )}
    </>
  )
}
export default Layout
