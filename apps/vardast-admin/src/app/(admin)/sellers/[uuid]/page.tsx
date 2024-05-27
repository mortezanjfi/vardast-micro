import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import SellerEdit from "@/app/(admin)/sellers/components/SellerEdit"

const BrandEditPage = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.seller.index")) {
    redirect("/")
  }

  return uuid && <SellerEdit uuid={uuid} />
}

export default BrandEditPage
