import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import UOMForm from "../components/UOMForm"

const CreateUOMPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.uom.store")) {
    redirect("/admin")
  }

  return <UOMForm />
}

export default CreateUOMPage
