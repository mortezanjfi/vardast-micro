import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MobileScrollProvider from "@/app/components/header/MobileScrollProvider"
import MobileNavigation from "@/app/components/mobile-navigation"

// import { authOptions } from "@vardast/auth/authOptions"

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
          {process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "user" && (
            <MobileNavigation />
          )}
        </>
      ) : (
        children
      )}
    </>
  )
}
