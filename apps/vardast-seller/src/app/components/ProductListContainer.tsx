/* eslint-disable no-unused-vars */
import { ReactElement, useState } from "react"
import clsx from "clsx"

import { ICategoryListLoader } from "@/app/(seller)/categories/components/CategoryListLoader"

export enum ProductContainerType {
  PHOTO = "photo",
  LARGE_LIST = "large-list",
  PRODUCT_PAGE_LIST = "product-page-list",
  SMALL_LIST = "small-list"
}

interface IProductListContainer {
  type?: ProductContainerType
  CardLoader?: React.FC

  children(_: {
    selectedItemId: ICategoryListLoader
    setSelectedItemId: (_?: any) => void
  }): ReactElement
}

const ProductListContainer: React.FC<IProductListContainer> = ({
  type = ProductContainerType.LARGE_LIST,
  CardLoader,
  children
}) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  return (
    <div
      className={clsx(
        "grid bg-alpha-white",
        type === ProductContainerType.LARGE_LIST
          ? "grid-cols-1 divide-y divide-alpha-200 px-6 sm:grid-cols-2 md:grid-cols-3 md:divide-none md:px-0 lg:grid-cols-4 xl:grid-cols-6"
          : type === ProductContainerType.PRODUCT_PAGE_LIST
            ? "grid-cols-1 divide-y divide-alpha-200 px-6 sm:grid-cols-3 md:grid-cols-2 md:divide-none md:px-0 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            : "grid-cols-2 gap-0.5"
      )}
    >
      {CardLoader &&
        [...Array(3)].map((loader) => (
          <CardLoader key={`product-card-loader-${loader}`} />
        ))}
      {children({ selectedItemId, setSelectedItemId })}
    </div>
  )
}

export default ProductListContainer
