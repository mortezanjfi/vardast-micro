import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Attributes from "./components/Attributes"

const AttributesIndex = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.attribute.index")) {
    redirect("/")
  }

  return <Attributes />
}

export default AttributesIndex
