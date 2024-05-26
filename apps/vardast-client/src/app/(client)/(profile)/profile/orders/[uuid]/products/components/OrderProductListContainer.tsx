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
    <div className={clsx("flex flex-col gap-6 bg-alpha-white")}>
      {CardLoader &&
        [...Array(3)].map((loader) => (
          <CardLoader key={`product-card-loader-${loader}`} />
        ))}
      {children({ selectedItemId, setSelectedItemId })}
    </div>
  )
}

export default OrderProductListContainer
