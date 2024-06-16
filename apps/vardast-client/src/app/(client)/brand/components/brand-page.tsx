"use client"

import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
// import BrandHeader from "@/app/(public)/(pages)/brand/components/primary-header"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import ProductList from "@vardast/component/product-list"
import { GetBrandQuery, IndexProductInput } from "@vardast/graphql/generated"
import { setBreadCrumb } from "@vardast/provider/LayoutProvider/use-layout"
import { getBrandQueryFn } from "@vardast/query/queryFns/brandQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { LucideWarehouse } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

interface BrandPageProps {
  isMobileView: boolean
  slug: Array<string | number>
  args: IndexProductInput
}

const BrandPage = ({ isMobileView, args, slug }: BrandPageProps) => {
  const { t } = useTranslation()
  const brandQuery = useQuery<GetBrandQuery>(
    [QUERY_FUNCTIONS_KEY.BRAND_QUERY_KEY, { id: +slug[0] }],
    () => getBrandQueryFn({ id: +slug[0] }),
    {
      keepPreviousData: true
    }
  )

  setBreadCrumb([
    {
      label: t("common:producer_vardast"),
      path: "/brands",
      isCurrent: false
    },
    {
      label: brandQuery?.data.brand.name,
      path: `/brand/${brandQuery?.data.brand.id}/${brandQuery?.data.brand.name}`,
      isCurrent: true
    }
  ])

  if (brandQuery.isLoading) return <Loading />
  if (brandQuery.error) return <LoadingFailed />
  if (!brandQuery?.data) return <NoResult entity="brand" />

  return (
    <>
      <>{/* <BrandHeader brand={brandQuery?.data.brand as Brand} /> */}</>
      <div className="flex flex-col items-center justify-center md:mb-12 md:flex-row md:items-end md:justify-start md:gap-6">
        <div className="relative flex h-16 w-full items-center justify-center rounded-md border border-alpha-200 bg-alpha-50 md:h-28 md:w-28">
          {brandQuery?.data.brand.logoFile ? (
            <Image
              src={brandQuery?.data.brand.logoFile.presignedUrl.url}
              fill
              alt={brandQuery?.data.brand.name}
              className="object-contain p-3"
            />
          ) : (
            <LucideWarehouse
              className="h-8 w-8 text-alpha-400 md:h-10 md:w-10"
              strokeWidth={1.5}
            />
          )}
        </div>
      </div>
      <ProductList
        args={args}
        isMobileView={isMobileView}
        selectedCategoryIds={args["categoryIds"] || undefined}
        brandId={+slug[0]}
      />
    </>
  )
}

export default BrandPage
