"use client"

import Link from "@vardast/component/Link"
import ProductSectionContainer from "@vardast/component/ProductSectionContainer"
import { Price, Product } from "@vardast/graphql/generated"
import slugify from "@vardast/util/persian-slugify"
import { Session } from "next-auth"

import ProductLowestPriceInfo from "@/app/(client)/product/components/ProductLowestPriceInfo"

interface IProductIntroduce {
  isMobileView: boolean
  product: Product
  session?: Session | null
}

const ProductIntroduce = ({
  isMobileView,
  session,
  product
}: IProductIntroduce) => {
  return (
    <ProductSectionContainer>
      <div className="flex flex-col gap-4">
        <h1 className="text-base font-semibold sm:text-lg">{product.name}</h1>
        <Link
          className="flex flex-shrink-0 py-2"
          href={`/brand/${product.brand.id}/${slugify(product.brand.name)}`}
        >
          <span className="text-alpha-500">برند:</span>
          <span className="px-2 text-info">{product.brand.name}</span>
        </Link>
        <ProductLowestPriceInfo
          isMobileView={isMobileView}
          uom={product.uom.name}
          session={session}
          lowestPrice={product.lowestPrice as Price}
        />
      </div>
    </ProductSectionContainer>
  )
}

export default ProductIntroduce
