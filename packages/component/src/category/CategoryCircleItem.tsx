"use client"

import { useState } from "react"
import Image from "next/image"
import { Category } from "@vardast/graphql/generated"
import clsx from "clsx"

import Link from "../Link"
import { ICategoryListLoader } from "./CategoryListLoader"

type Props = {
  slug?: Array<string | number>
  isProductsPage?: boolean
  data: Category
  isMobileView?: boolean
}

export const circleSizes = {
  width: "w-[25vw] min-w-[100px] max-w-[125px]",
  height: "h-[25vw] max-h-[125px] min-h-[100px]",
  paddingTop: "pt-[25vw]"
}

export const smallCircleSizes = {
  width: "w-[50px]",
  height: "h-[50px]"
}

const productPageSizes = {
  width: "w-20",
  height: "h-20"
}
const categoryDefaultClassName =
  "ml-3 sm:mx-auto flex h-full flex-shrink-0 flex-col justify-start gap-y-4"

export function CategoryCircleItemLoader({
  isProductsPage,
  isMobileView
}: {
  isMobileView?: boolean
  isProductsPage?: boolean
}) {
  return (
    <div
      className={clsx(
        categoryDefaultClassName,
        isMobileView ? "" : "mx-auto",
        isProductsPage ? productPageSizes.width : circleSizes.width
      )}
    >
      <div
        className={clsx(
          "animated-card relative rounded-full border border-alpha-400 bg-alpha-50 p-1",
          isProductsPage ? productPageSizes.height : circleSizes.height
        )}
      ></div>
      <h5 className="animated-card relative z-20 h-10 whitespace-pre-wrap bg-opacity-60 text-center font-semibold"></h5>
    </div>
  )
}

export default function CategoryCircleItem({
  slug,
  isProductsPage,
  data,
  isMobileView
}: Props) {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)

  return (
    <Link
      onClick={() => {
        setSelectedItemId(data.id)
      }}
      href={`${
        isMobileView && !(slug?.length > 0)
          ? `/category/${data.id}/${data.title}`
          : `/products/${data.id}/${data.title}`
      }`}
      className={clsx(
        categoryDefaultClassName,
        isMobileView ? "" : "mx-auto",
        isProductsPage ? productPageSizes.width : circleSizes.width
      )}
    >
      <div
        className={clsx(
          "relative overflow-hidden rounded-full border border-alpha-400 bg-alpha-50 p-1",
          isProductsPage ? productPageSizes.height : circleSizes.height,
          selectedItemId === data.id ? "border-2 border-primary" : ""
        )}
      >
        <Image
          src={
            data?.imageCategory
              ? data?.imageCategory[0]?.file.presignedUrl?.url
              : `/images/categories/1.png`
          }
          alt="category"
          fill
          sizes="100"
          className="rounded-xl object-cover"
        />
      </div>
      <h5
        className={clsx(
          "relative z-20 whitespace-pre-wrap bg-opacity-60 text-center font-semibold",
          selectedItemId === data.id ? "text-primary-600" : ""
        )}
      >
        {data.title}
      </h5>
    </Link>
  )
}
