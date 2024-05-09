// import { redirect } from "next/navigation"
// import { getServerSession } from "next-auth"

// import { authOptions } from "@vardast/auth/authOptions"
import MobileScrollProvider from "@vardast/component/header/MobileScrollProvider"
import MobileNavigation from "@vardast/component/mobile-navigation"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isMobileView = await CheckIsMobileView()

  return (
    <>
      {isMobileView ? (
        <>
          <MobileScrollProvider>{children}</MobileScrollProvider>
          <MobileNavigation />
        </>
      ) : (
        children
      )}
    </>
  )
}
