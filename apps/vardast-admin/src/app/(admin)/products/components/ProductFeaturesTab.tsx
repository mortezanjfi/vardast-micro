import { Dispatch, SetStateAction } from "react"
import { Product } from "@vardast/graphql/generated"

import { ProductFormNewType } from "@/app/(admin)/products/components/ProductFormNew"

type ProductFeaturesTabProps = {
  product: Product
  setActiveTab: Dispatch<SetStateAction<string>>
  activeTab: string
  setNewProductData: Dispatch<SetStateAction<ProductFormNewType | undefined>>
}

export const ProductFeaturesTab = ({}: ProductFeaturesTabProps) => {
  return <div>ProductFeaturesTab</div>
}
