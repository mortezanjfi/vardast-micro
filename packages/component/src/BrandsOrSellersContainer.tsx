import { ReactElement, useState } from "react"
import clsx from "clsx"

import { ICategoryListLoader } from "@/app/(public)/(purchaser)/category/components/CategoryListLoader"

export enum BrandContainerType {
  // eslint-disable-next-line no-unused-vars
  Brands_Page_List = "brand-page-list"
}
interface IBrandsOrSellersContainer {
  type?: BrandContainerType
  CardLoader?: React.FC
  children(_: {
    selectedItemId: ICategoryListLoader
    setSelectedItemId: (_?: any) => void
  }): ReactElement
}

const BrandsOrSellersContainer: React.FC<IBrandsOrSellersContainer> = ({
  children,
  type,
  CardLoader
}) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  return (
    <div
      className={clsx(
        type === BrandContainerType.Brands_Page_List
          ? " grid grid-cols-3 gap divide-alpha-200 p px-6 pb-5 sm:gap-0 sm:divide-y  md:grid-cols-4 md:px-0 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6"
          : "grid grid-cols-3 gap p pb-5 md:grid-cols-4 lg:grid-cols-5"
      )}
    >
      {CardLoader &&
        [...Array(3)].map((_, loader) => (
          <CardLoader key={`brand-card-loader-${loader}`} />
        ))}
      {children({ selectedItemId, setSelectedItemId })}
    </div>
  )
}

export default BrandsOrSellersContainer
