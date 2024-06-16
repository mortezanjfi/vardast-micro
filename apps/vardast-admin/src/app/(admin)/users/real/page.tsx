import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Users from "./components/Users"

const UsersIndex = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.users.user.index")) {
    redirect("/")
  }

  return <Users />
}

export default UsersIndex
