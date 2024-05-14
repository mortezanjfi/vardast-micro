"use client"

import Breadcrumb from "@vardast/component/Breadcrumb"
import { IndexBrandInput } from "@vardast/graphql/generated"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import BrandsList from "@/app/(client)/brands/components/BrandsList"

// import BrandsList from "@/app/(client)/brands/BrandsList"

interface BrandsPageProps {
  isMobileView: boolean
  args: IndexBrandInput
  limitPage?: number
  hasSearch?: boolean
}

const BrandsPage = ({ isMobileView, args, limitPage }: BrandsPageProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={clsx(
        "flex flex-col gap-9 ",
        !isMobileView && "bg-alpha-white"
      )}
    >
      {!isMobileView && (
        <div className="border-b-2 bg-alpha-white">
          <Breadcrumb
            dynamic={false}
            items={[
              {
                label: t("common:brands_vardast"),
                path: "/brands",
                isCurrent: true
              }
            ]}
          />
        </div>
      )}

      <BrandsList
        limitPage={limitPage}
        args={args}
        isMobileView={isMobileView}
      />
    </div>
  )
}

export default BrandsPage
