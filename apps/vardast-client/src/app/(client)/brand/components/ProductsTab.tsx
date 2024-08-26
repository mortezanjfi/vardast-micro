"use client"

import ProductList from "@vardast/component/product-list"

import { IBrandOrSellerProfile } from "./BrandProfile"

type Props = { isBrand?: boolean; productsProps: IBrandOrSellerProfile }

const ProductsTab = ({
  // isBrand = true,
  productsProps
}: Props) => {
  productsProps.args.categoryIds = []
  return (
    <ProductList
      args={productsProps.args}
      isMobileView={productsProps.isMobileView}
      sellerId={productsProps.args.sellerId}
    />
  )
}
export default ProductsTab
