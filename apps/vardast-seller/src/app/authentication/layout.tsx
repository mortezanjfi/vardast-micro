import MobileScrollProvider from "@vardast/component/header/MobileScrollProvider"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

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
        </>
      ) : (
        children
      )}
    </>
  )
}
