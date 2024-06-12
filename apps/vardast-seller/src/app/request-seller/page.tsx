import { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import paths from "@vardast/lib/paths"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import ProfileSellerForm from "@/app/request-seller/components/ProfileSellerForm"

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
    return redirect(`${paths.signin}?ru=/request-seller`)
  }

  if (session?.profile?.roles.some((role) => role?.name === "seller")) {
    return redirect("/")
  }

  return <ProfileSellerForm isMobileView={isMobileView} />
}

export default ProfileSellerPage
