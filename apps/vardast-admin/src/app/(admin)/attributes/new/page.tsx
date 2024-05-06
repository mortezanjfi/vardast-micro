import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import AttributeForm from "../components/AttributeForm"

const CreateAttributePage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.attribute.store")) {
    redirect("/admin")
  }

  return <AttributeForm />
}

export default CreateAttributePage
