import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import ProductForm from "@/app/(admin)/products/components/ProductForm"

const ProductCreatePage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.product.index")) {
    redirect("/")
  }

  return <ProductForm />
}

export default ProductCreatePage
