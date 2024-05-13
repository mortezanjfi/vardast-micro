// import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
// import { authOptions } from "@vardast/auth/authOptions"
import MobileScrollProvider from "@vardast/component/header/MobileScrollProvider"
import { SearchActionModal } from "@vardast/component/search"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import SellerLayoutComponent from "@/app/(seller)/components/SellerLayoutComponent"

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isMobileView = await CheckIsMobileView()

  const session = await getServerSession(authOptions)

  if (
    !!session &&
    !!session?.profile?.roles.some((role) => role?.name === "seller")
  ) {
    return (
      <>
        <SearchActionModal isMobileView={isMobileView} />
        {isMobileView ? (
          <MobileScrollProvider>{children}</MobileScrollProvider>
        ) : (
          <SellerLayoutComponent session={session}>
            {children}
          </SellerLayoutComponent>
        )}
      </>
    )
  }

  return redirect("/auth/signin")
}
