import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Offers from "@/app/(admin)/offers/components/Offers"

const OffersIndex = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.offer.index")) {
    redirect("/")
  }

  return <Offers />
}

export default OffersIndex
