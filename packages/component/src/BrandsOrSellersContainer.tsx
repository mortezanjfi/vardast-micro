/* eslint-disable no-unused-vars */
import { ReactElement, useState } from "react"
import { ICategoryListLoader } from "@vardast/type/Loader"
import clsx from "clsx"

export enum BrandContainerType {
  DEFAULT,
  BRANDS_PAGE_LIST = "brand-page-list",
  SELLERS_PAGE_LIST = "sellers-page-list",
  Brand_Or_Seller_Profile = "brand-or-seller-profile"
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

  const classNameByType = {
    DEFAULT: "grid grid-cols-3 gap p pb-5 md:grid-cols-4 lg:grid-cols-5",
    [BrandContainerType.SELLERS_PAGE_LIST]:
      "grid  grid-cols-3 gap divide-alpha-200 p pb-5 sm:gap-0 sm:divide-y md:grid-cols-4  md:px-0 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6",
    [BrandContainerType.BRANDS_PAGE_LIST]:
      "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:divide-y-0 divide-y  divide-alpha-300 px-3 pb-5 md:px-0 bg-alpha-white",
    [BrandContainerType.Brand_Or_Seller_Profile]:
      "grid grid-cols-3 gap p pb-5 md:grid-cols-4 lg:grid-cols-5 md:gap-0 grid w-full grid-cols-1 divide-y divide-alpha-200  sm:grid-cols-3 md:grid-cols-2 md:divide-none md:px-0 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
  }

  return (
    <div
      className={clsx(type ? classNameByType[type] : classNameByType.DEFAULT)}
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
