import withMobileHeader from "@vardast/component/withMobileHeader"

import SigninForm from "@/app/(public)/auth/signin/[...slug]/components/SigninForm"

const SigninPage = async () => {
  // const session = await getServerSession(authOptions)

  // if (
  //   session?.profile?.roles.some(
  //     (role) => role?.name === "admin" || role?.name === "seller"
  //   )
  // ) {
  //   redirect("/admin")
  // }

  return <SigninForm />
}

export default withMobileHeader(SigninPage, {
  hasLogo: true
})
