"use client"

import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import Breadcrumb from "@vardast/component/Breadcrumb"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import { GetBrandQuery, IndexProductInput } from "@vardast/graphql/generated"
import { getBrandQueryFn } from "@vardast/query/queryFns/brandQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { LucideWarehouse } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

// import BrandHeader from "@/app/(public)/(pages)/brand/components/primary-header"
import ProductList from "@/app/components/product-list"

interface BrandPageProps {
  isMobileView: boolean
  slug: Array<string | number>
  args: IndexProductInput
}

const BrandPage = ({ isMobileView, args, slug }: BrandPageProps) => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const brandQuery = useQuery<GetBrandQuery>(
    [QUERY_FUNCTIONS_KEY.BRAND_QUERY_KEY, { id: +slug[0] }],
    () => getBrandQueryFn({ id: +slug[0], accessToken: session?.accessToken }),
    {
      keepPreviousData: true
    }
  )

  if (brandQuery.isLoading) return <Loading />
  if (brandQuery.error) return <LoadingFailed />
  if (!brandQuery?.data) return <NoResult entity="brand" />

  return (
    <>
      <>{/* <BrandHeader brand={brandQuery?.data.brand as Brand} /> */}</>
      <div className="bg-alpha-white">
        <Breadcrumb
          dynamic={false}
          items={[
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
          ]}
        />
      </div>

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
