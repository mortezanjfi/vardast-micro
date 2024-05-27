import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import UserEdit from "../components/UserEdit"

const UserEditPage = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.users.user.index")) {
    redirect("/")
  }
  return uuid && <UserEdit uuid={uuid} />
}

export default UserEditPage
