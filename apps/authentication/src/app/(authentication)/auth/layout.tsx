import MobileScrollProvider from "@vardast/component/header/MobileScrollProvider"
import MobileNavigation from "@vardast/component/mobile-navigation"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

// import { authOptions } from "@core/lib/authOptions"

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
        <div className="flex h-full w-full items-center justify-center">
          {children}
        </div>
      )}
    </>
  )
}
