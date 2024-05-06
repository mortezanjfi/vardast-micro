// import { redirect } from "next/navigation"
// import { getServerSession } from "next-auth"

import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

// import { authOptions } from "@vardast/auth/authOptions"
import MobileScrollProvider from "@/app/components/header/MobileScrollProvider"
import MobileNavigation from "@/app/components/mobile-navigation"

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
