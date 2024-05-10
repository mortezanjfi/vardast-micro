import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import ProductEdit from "@/app/(admin)/products/components/ProductEdit"

const ProductEditPage = async ({
  params: { uuid }
}: {
  params: { uuid: number }
}) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.product.moderated_update")) {
    redirect("/")
  }

  return uuid && <ProductEdit id={uuid} />
}

export default ProductEditPage
