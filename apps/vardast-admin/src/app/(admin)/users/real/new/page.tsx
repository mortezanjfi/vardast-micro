import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import UserForm from "../[uuid]/components/UserModal"

const CreateBrandPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.users.user.index")) {
    redirect("/")
  }

  return <UserForm />
}

export default CreateBrandPage
