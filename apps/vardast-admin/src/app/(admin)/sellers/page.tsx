import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Sellers from "@/app/(admin)/sellers/components/Sellers"

const SellersIndex = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.seller.index")) {
    redirect("/admin")
  }

  return <Sellers />
}

export default SellersIndex
