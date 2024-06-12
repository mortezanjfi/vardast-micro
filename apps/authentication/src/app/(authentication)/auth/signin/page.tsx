import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import SigninForm from "@/app/(authentication)/components/SigninForm"

const SigninPage = async () => {
  const isMobileView = await CheckIsMobileView()
  return <SigninForm hasPassword isMobileView={isMobileView} />
}

export default SigninPage
