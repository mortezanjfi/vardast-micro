/* eslint-disable no-unused-vars */
import { ReactElement, useState } from "react"
import { ICategoryListLoader } from "@vardast/type/Loader"
import clsx from "clsx"

interface IOrderProductListContainer {
  CardLoader?: React.FC

  children(_: {
    selectedItemId: ICategoryListLoader
    setSelectedItemId: (_?: any) => void
  }): ReactElement
}

const OrderProductListContainer: React.FC<IOrderProductListContainer> = ({
  CardLoader,
  children
}) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  return (
    <div
      className={clsx(
        "grid grid-cols-1 divide-y divide-alpha-200 bg-alpha-white"
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

export const OrderProductCardSkeleton = ({}: {}) => {
  return (
    <div className="py-5">
      <div className="animated-card h-[200px] rounded "></div>
    </div>
  )
}

export default OrderProductListContainer
