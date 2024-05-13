import MobileScrollProvider from "@vardast/component/header/MobileScrollProvider"
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
        <MobileScrollProvider>{children}</MobileScrollProvider>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          {children}
        </div>
      )}
    </>
  )
}
