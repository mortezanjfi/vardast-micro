import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import SellerForm from "../components/SellerForm"

const CreateSellerPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.seller.store")) {
    redirect("/admin")
  }

  return <SellerForm />
}

export default CreateSellerPage
