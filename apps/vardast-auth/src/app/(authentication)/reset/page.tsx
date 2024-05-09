import withMobileHeader from "@vardast/component/withMobileHeader"

import ResetForm from "@/app/(authentication)/reset/components/ResetForm"

const ResetPage = async () => {
  // const session = await getServerSession(authOptions)

  // console.log({ session })

  // if (!session) {
  //   redirect("/auth/signin")
  // }

  return <ResetForm />
}

export default withMobileHeader(ResetPage, {
  hasLogo: true
})
