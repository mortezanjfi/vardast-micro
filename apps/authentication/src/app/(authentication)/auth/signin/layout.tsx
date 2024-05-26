import { PropsWithChildren } from "react"
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()
  const session = await getServerSession(authOptions)

  if (!!session) {
    redirect("/")
  }

  return (
    <MobileBaseLayout
      extraPadding={!isMobileView}
      background={!isMobileView}
      fullHeight={true}
      bgWhite={isMobileView}
      isAuth={true}
      isMobileView={isMobileView}
    >
      {children}
    </MobileBaseLayout>
  )
}
export default Layout
