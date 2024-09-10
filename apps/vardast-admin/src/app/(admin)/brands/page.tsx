import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import BrandsPage from "./components/BrandsPage"

const BrandsIndex = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.brand.index")) {
    redirect("/")
  }

  return <BrandsPage />
}

export default BrandsIndex
