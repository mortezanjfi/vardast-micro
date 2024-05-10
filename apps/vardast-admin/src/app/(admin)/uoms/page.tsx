import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import UOMs from "./components/UOMs"

const UOMsIndex = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.uom.index")) {
    redirect("/")
  }

  return <UOMs />
}

export default UOMsIndex
