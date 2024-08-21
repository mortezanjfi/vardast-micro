"use client"

import ProductList from "@vardast/component/product-list"

import { IBrandOrSellerProfile } from "./BrandProfile"

type Props = { isBrand?: boolean; productsProps: IBrandOrSellerProfile }

const ProductsTab = ({
  // isBrand = true,
  productsProps
}: Props) => {
  productsProps.args["categoryIds"] = []
  return (
    <ProductList
      isMobileView={productsProps.isMobileView}
      args={productsProps.args}
      sellerId={productsProps.args.sellerId as number}
    />
  )
}
export default ProductsTab
