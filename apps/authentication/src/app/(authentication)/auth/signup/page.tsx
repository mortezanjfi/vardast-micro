import SingupForm from "@/app/(authentication)/components/SingupForm"

const SignupPage = async () => {
  // const session = await getServerSession(authOptions)

  // if (
  //   session?.profile?.roles.some(
  //     (role) => role?.name === "admin" || role?.name === "seller"
  //   )
  // ) {
  //   redirect("/admin")
  // }

  return <SingupForm />
}

export default SignupPage
