"use client"

import Image from "next/image"
import sameProductImage from "@vardast/asset/images/same-product.png"
import { Product } from "@vardast/graphql/generated"

import ProductCard from "./product-card"
import ProductVerticalCard from "./ProductVerticalCard"

export type ProductSliderProps = {
  products: Product[]
  isMobileView?: boolean
  hasExtraItem?:
    | {
        title: string
        subtitle: string
      }
    | undefined
}

const ProductSlider = ({
  products,
  hasExtraItem,
  isMobileView
}: ProductSliderProps) => {
  return (
    <div className="h-full overflow-hidden">
      <div className="flex h-full w-full overflow-x-auto pr-5">
        {hasExtraItem && (
          <div
            className={`min-h-full w-[37vw] flex-shrink-0 cursor-pointer pl-5 md:w-60`}
          >
            <div className="flex h-full flex-col items-center justify-center gap-y-8">
              {/* <h3 className="font-semibold text-alpha-white">
                {hasExtraItem.title}
              </h3> */}
              <Image
                alt={"same-product"}
                className="object-contain"
                height={isMobileView ? 120 : 230}
                src={sameProductImage}
                width={isMobileView ? 120 : 230}
              />
              <div className="flex items-center gap-1">
                {/* <h3 className="font-semibold text-alpha-white">
                  {hasExtraItem.subtitle}{" "}
                </h3> */}
                {/* <ChevronLeft className="text-alpha-white h-" /> */}
              </div>
            </div>
          </div>
        )}
        {products.map((product) => (
          <div
            className={`ml-2 h-full w-[37vw] flex-shrink-0 cursor-pointer rounded-xl bg-alpha-white md:w-60`}
            key={product.id}
          >
            {isMobileView ? (
              <ProductVerticalCard product={product} />
            ) : (
              <ProductCard product={product} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductSlider
