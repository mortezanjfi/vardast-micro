import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import ProfileSellerForm from "@/app/(authentication)/request-seller/components/ProfileSellerForm"

const ProfileSellerPage = async () => {
  const session = await getServerSession(authOptions)
  const isMobileView = await CheckIsMobileView()

  if (!session) {
    return redirect(`${process.env.NEXT_PUBLIC_AUTHENTICATION_BASE_PATH}signin`)
  }

  return <ProfileSellerForm isMobileView={isMobileView} />
}

export default withMobileHeader(ProfileSellerPage, {
  title: "درخواست تبدیل به فروشنده"
})
