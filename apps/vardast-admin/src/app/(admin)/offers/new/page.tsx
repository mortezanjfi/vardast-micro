import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import OfferForm from "../components/OfferForm"

const CreateOfferPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.offer.store.mine")) {
    redirect("/admin")
  }

  return <OfferForm />
}

export default CreateOfferPage
