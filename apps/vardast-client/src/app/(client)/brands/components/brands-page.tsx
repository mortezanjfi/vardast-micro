"use client"

import { IndexBrandInput } from "@vardast/graphql/generated"
import clsx from "clsx"

import BrandsList from "@/app/(client)/brands/components/BrandsList"

// import BrandsList from "@/app/(client)/brands/BrandsList"

interface BrandsPageProps {
  isMobileView: boolean
  args: IndexBrandInput
  limitPage?: number
  hasSearch?: boolean
}

const BrandsPage = ({ isMobileView, args, limitPage }: BrandsPageProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-9 ",
        !isMobileView && "bg-alpha-white"
      )}
    >
      <BrandsList
        limitPage={limitPage}
        args={args}
        isMobileView={isMobileView}
      />
    </div>
  )
}

export default BrandsPage
