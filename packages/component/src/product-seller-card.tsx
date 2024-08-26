"use client"

import { forwardRef, Ref, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import blankImage from "@vardast/asset/images/blank.png"
import frameLessImage from "@vardast/asset/images/frameLess.png"
import { Product } from "@vardast/graphql/generated"
import { ICategoryListLoader } from "@vardast/type/Loader"
import clsx from "clsx"

import Link from "./Link"
import PriceTitle from "./PriceTitle"
import { ProductContainerType } from "./ProductListContainer"
import Rating from "./Rating"

interface ProductSellerCardProps {
  product: Product
  containerType?: ProductContainerType
  selectedItemId?: ICategoryListLoader
  setSelectedItemId?: (_?: ICategoryListLoader) => void
}

export const ProductSellerCardSkeleton = ({
  containerType = ProductContainerType.LARGE_LIST
}: {
  containerType?: ProductContainerType
}) => {
  const [ratio, setRatio] = useState(1 / 1)
  return (
    <div className="relative bg-alpha-white px-6 hover:z-10 md:py md:hover:shadow-lg">
      <div
        className={clsx(
          "grid h-full w-full flex-1 gap-2 bg-alpha-white py md:border-none lg:flex lg:flex-col lg:px-4",
          containerType === ProductContainerType.LARGE_LIST
            ? "grid-cols-3 border-b"
            : "overflow-hidden"
        )}
      >
        <div
          className={clsx(
            "relative flex flex-shrink-0 transform flex-col items-center justify-center bg-center bg-no-repeat align-middle transition-all duration-1000 ease-out"
          )}
        >
          <div className="w-full">
            <Image
              alt="skeleton"
              className="animated-card"
              height={400 / ratio}
              layout="fixed"
              objectFit="contain"
              src={frameLessImage}
              width={400}
              onLoad={({ naturalWidth, naturalHeight }: any) => {
                setRatio(naturalWidth / naturalHeight)
              }}
            />
          </div>
        </div>
        {containerType !== ProductContainerType.PHOTO && (
          <div className="lg:col-span1 col-span-2 flex flex-1 flex-col">
            <h5 className="animated-card line-clamp-2 h-11 font-semibold"></h5>
            <div className="flex h-8 w-full py-2">
              <div className="animated-card h-full w-8"></div>
            </div>
            <div className="flex h-14  w-full flex-col items-end">
              <div className="flex h-1/2 w-full items-center justify-end gap-x">
                <span className="animated-card h-1/2 w-8 rounded-full p-1 px-1.5 text-center text-sm font-semibold leading-none"></span>
                <span className="animated-card h-1/2 w-8 text-sm line-through"></span>
              </div>
              <div className="flex h-1/2 w-full items-center justify-end">
                <div className="animated-card h-full w-20"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ProductSellerCard = forwardRef(
  (
    {
      product,
      containerType = ProductContainerType.LARGE_LIST,
      selectedItemId,
      setSelectedItemId
    }: ProductSellerCardProps,
    ref: Ref<HTMLAnchorElement> | undefined
  ) => {
    const productContainerRef = useRef<HTMLDivElement>(null)
    const [imageContainerHeight, setImageContainerHeight] = useState(146)
    const onLoaddImage = () => {
      const div = productContainerRef.current
      if (div) {
        div.className = div.className + " opacity-100"
      }
    }

    useEffect(() => {
      const div = productContainerRef.current
      if (div) {
        setImageContainerHeight(div.children[0].clientWidth)
      }
    }, [])

    const hasDiscount = false

    return (
      <Link
        className={clsx(
          "md:h-none relative grid h-[calc((100vw-1.5rem)/2)] max-h-[calc((100vw-1.5rem)/2)] min-h-[calc((100vw-1.5rem)/2)] w-full flex-1 gap-2 rounded border bg-alpha-white p transition hover:z-10 md:h-full md:max-h-full md:min-h-full md:py md:ring-1 md:!ring-alpha-200 md:hover:shadow-lg lg:flex lg:flex-col lg:px-4",
          containerType === ProductContainerType.LARGE_LIST
            ? "grid-cols-3"
            : "overflow-hidden"
          // product.id === selectedItemId && "!border-y border-primary"
        )}
        href={`/product/${product.id}/${product.name}`}
        ref={ref}
        onClick={() => {
          setSelectedItemId && setSelectedItemId(product.id)
        }}
      >
        {product.id === selectedItemId && (
          <div className="absolute left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-alpha-white bg-opacity-50">
            {/* <Loader2Icon className="h-10 w-10 animate-spin text-primary" /> */}
          </div>
        )}
        <div
          className={`relative flex flex-shrink-0 transform flex-col items-center justify-center bg-center bg-no-repeat align-middle opacity-0 transition-all duration-1000 ease-out`}
          ref={productContainerRef}
        >
          <div
            className="w-full"
            style={{
              height: imageContainerHeight
            }}
          >
            {product.images.at(0)?.file.presignedUrl.url ? (
              <Image
                alt={product.name}
                className="object-contain"
                fill
                src={product.images.at(0)?.file.presignedUrl.url}
                onLoad={onLoaddImage}
              />
            ) : (
              <Image
                alt={product.name}
                className="object-contain"
                fill
                src={blankImage}
                onLoad={onLoaddImage}
              />
            )}
          </div>
        </div>
        {containerType !== ProductContainerType.PHOTO && (
          <div className="lg:col-span1 col-span-2 grid h-full grid-rows-7">
            <div></div>
            <div className="row-span-2">
              <h5
                className="my-auto line-clamp-2 max-h-10 overflow-hidden whitespace-pre-wrap font-semibold"
                title={product.name}
              >
                {product.name}
              </h5>
            </div>
            <div className="flex w-full">
              {product.rating && product.rating > 0 ? (
                <Rating rating={product.rating} />
              ) : (
                ""
              )}
            </div>
            {product.lowestPrice && (
              <>
                <div className="flex w-full items-center justify-end gap-x">
                  {hasDiscount && (
                    <span className="rounded-full bg-error p-1 px-1.5 text-center text-sm font-semibold leading-none text-white">
                      {digitsEnToFa(15)}%
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-sm text-alpha-500 line-through">
                      {digitsEnToFa(addCommas(`${product.lowestPrice.amount}`))}
                    </span>
                  )}
                </div>
                <div className="flex w-full items-center justify-end">
                  <PriceTitle price={product.lowestPrice.amount} size="xs" />
                </div>
                {product?.uom?.name && (
                  <div className="flex items-center justify-end text-xs text-alpha-500">
                    هر {product.uom.name}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Link>
    )
  }
)

export default ProductSellerCard
