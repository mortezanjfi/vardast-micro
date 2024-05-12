import Card from "@vardast/component/Card"
import withMobileHeader from "@vardast/component/withMobileHeader"
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

  return isMobileView ? (
    <SigninForm />
  ) : (
    <Card className="mx-auto flex w-1/3 flex-col">
      <SigninForm />
    </Card>
  )
}

export default withMobileHeader(SigninPage, {
  hasLogo: true
})
