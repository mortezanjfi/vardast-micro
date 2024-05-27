import { PropsWithChildren } from "react"
import MobileBaseLayout from "@vardast/component/MobileBaseLayout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const isMobileView = await CheckIsMobileView()
  // const session = await getServerSession(authOptions)

  // console.log({ session })

  // if (!!session?.accessToken) {
  //   await signOut({
  //     callbackUrl: "/"
  //   })
  // }

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
