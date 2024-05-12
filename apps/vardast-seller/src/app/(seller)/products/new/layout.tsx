import { PropsWithChildren } from "react"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <>
      {isMobileView ? (
        <MobileBaseLayout
          extraPadding={!isMobileView}
          background={!isMobileView}
          isMobileView={isMobileView}
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
