// import { redirect } from "next/navigation"
// import { getServerSession } from "next-auth"

import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import SellerLayoutComponent from "@/app/(seller)/components/SellerLayoutComponent"
// import { authOptions } from "@vardast/auth/authOptions"
import MobileScrollProvider from "@/app/components/header/MobileScrollProvider"
import { SearchActionModal } from "@/app/components/search"

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  const isMobileView = CheckIsMobileView()

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

  return redirect("/auth/signin/seller-panel")
}
