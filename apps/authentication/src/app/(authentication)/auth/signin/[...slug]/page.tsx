import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import SigninForm from "@/app/(authentication)/components/SigninForm"

const SigninPage = async () => {
  const isMobileView = await CheckIsMobileView()
  // const session = await getServerSession(authOptions)

  // if (
  //   session?.profile?.roles.some(
  //     (role) => role?.name === "admin" || role?.name === "seller"
  //   )
  // ) {
  //   redirect("/admin")
  // }

  return <SigninForm isMobileView={isMobileView} />
}

export default SigninPage
