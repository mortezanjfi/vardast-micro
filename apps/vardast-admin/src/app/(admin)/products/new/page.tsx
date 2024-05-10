import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import { ProductFormNew } from "@/app/(admin)/products/components/ProductFormNew"

const ProductCreatePage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.product.store")) {
    redirect("/")
  }

  return <ProductFormNew />
}

export default ProductCreatePage
