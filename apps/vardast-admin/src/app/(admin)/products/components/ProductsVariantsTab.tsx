import { Dispatch, SetStateAction } from "react"
import { Product } from "@vardast/graphql/generated"

import { ProductFormNewType } from "@/app/(admin)/products/components/ProductFormNew"

type ProductsVariantsTabProps = {
  product: Product
  setActiveTab: Dispatch<SetStateAction<string>>
  activeTab: string
  setNewProductData: Dispatch<SetStateAction<ProductFormNewType | undefined>>
}

export const ProductsVariantsTab = ({}: ProductsVariantsTabProps) => {
  return <div>ProductsVariantsTab</div>
}
