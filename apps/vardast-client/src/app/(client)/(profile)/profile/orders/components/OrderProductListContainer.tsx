/* eslint-disable no-unused-vars */
import { ReactElement, useState } from "react"
import clsx from "clsx"

import { ICategoryListLoader } from "@/app/(public)/(purchaser)/category/components/CategoryListLoader"

export enum ProductContainerType {
  PHOTO = "photo",
  LARGE_LIST = "large-list",
  PRODUCT_PAGE_LIST = "product-page-list",
  SMALL_LIST = "small-list"
}

interface IOrderProductListContainer {
  type?: ProductContainerType
  CardLoader?: React.FC

  children(_: {
    selectedItemId: ICategoryListLoader
    setSelectedItemId: (_?: any) => void
  }): ReactElement
}

const OrderProductListContainer: React.FC<IOrderProductListContainer> = ({
  type = ProductContainerType.LARGE_LIST,
  CardLoader,
  children
}) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  return (
    <div className={clsx("flex flex-col bg-alpha-white")}>
      {CardLoader &&
        [...Array(3)].map((loader) => (
          <CardLoader key={`product-card-loader-${loader}`} />
        ))}
      {children({ selectedItemId, setSelectedItemId })}
    </div>
  )
}

export default OrderProductListContainer
