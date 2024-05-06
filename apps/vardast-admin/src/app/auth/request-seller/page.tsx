import { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import ProfileSellerForm from "@/app/auth/request-seller/components/ProfileSellerForm"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "درخواست تبدیل به فروشنده"
  }
}

const ProfileSellerPage = async () => {
  const session = await getServerSession(authOptions)
  const isMobileView = await CheckIsMobileView()

  if (!session) {
    return redirect("/auth/signin")
  }

  if (session?.profile.roles.some((role) => role?.name === "seller")) {
    return redirect("/seller-panel")
  }

  return <ProfileSellerForm isMobileView={isMobileView} />
}

export default withMobileHeader(ProfileSellerPage, {
  title: "درخواست تبدیل به فروشنده"
})
