"use client"

import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import PriceTitle from "@vardast/component/PriceTitle"
import ProductSectionContainer from "@vardast/component/ProductSectionContainer"
import { Product } from "@vardast/graphql/generated"
import slugify from "@vardast/util/persian-slugify"
import { formatDistanceToNow } from "date-fns"

interface IProductIntroduce {
  product: Product
}

const ProductIntroduce = ({ product }: IProductIntroduce) => {
  const discount = product.lowestPrice?.discount?.length
    ? product.lowestPrice?.discount
    : null

  return (
    <ProductSectionContainer>
      <h1 className="text-lg font-semibold">{product.name}</h1>
      <div className="flex justify-between">
        <Link
          className="flex-shrink-0 pt"
          href={`/brand/${product.brand.id}/${slugify(product.brand.name)}`}
        >
          <span className="text-alpha-500">برند:</span>
          <span className="px-2 text-info">{product.brand.name}</span>
        </Link>
        {discount &&
          discount.map((discountItem) => (
            <div
              key={discountItem.id}
              className="flex w-full items-center justify-end gap-x"
            >
              <span className="text-sm text-alpha-500 line-through">
                {discountItem.calculated_price &&
                  product?.lowestPrice?.amount &&
                  digitsEnToFa(addCommas(`${product.lowestPrice.amount}`))}
              </span>
              {discountItem.value && (
                <span className="rounded-full bg-error p-1 px-1.5 text-center text-sm font-semibold leading-none text-white">
                  %{digitsEnToFa(discountItem.value)}
                </span>
              )}
            </div>
          ))}
      </div>
      <div className="flex flex-row-reverse justify-between gap-y">
        {/* {product.rating && product.rating > 0 ? (
          <Rating rating={product.rating} />
        ) : (
          ""
        )} */}
        {product?.lowestPrice && (
          <div className="flex justify-between gap-x">
            <PriceTitle
              size="xs"
              // price={product.lowestPrice.amount}
              price={
                discount && discount.length && discount[0]?.calculated_price
                  ? +discount[0].calculated_price
                  : product.lowestPrice.amount
              }
            />
          </div>
        )}
        {product?.lowestPrice?.createdAt && (
          <div className="flex flex-wrap items-center justify-between text-xs text-alpha-500">
            آخرین بروزرسانی قیمت{" "}
            <span className="pr-1 font-medium text-error">
              {product.lowestPrice.createdAt &&
                digitsEnToFa(
                  formatDistanceToNow(
                    new Date(product.lowestPrice.createdAt).getTime(),
                    {
                      addSuffix: true
                    }
                  )
                )}
            </span>
          </div>
        )}
      </div>
      {product.lowestPrice && product.uom.name && (
        <div className="mr-auto flex justify-between pt text-xs text-alpha-500">
          <span>هر {product.uom.name}</span>
        </div>
      )}
    </ProductSectionContainer>
  )
}

export default ProductIntroduce
