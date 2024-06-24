import { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Sellers from "@/app/(admin)/sellers/components/Sellers"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "فروشندگان"
  }
}

const SellersIndex = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.seller.index")) {
    redirect("/")
  }

  return <Sellers />
}

export default SellersIndex
