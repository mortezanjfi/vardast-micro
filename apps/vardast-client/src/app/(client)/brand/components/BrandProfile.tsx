"use client"

import { useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useQuery } from "@tanstack/react-query"
import brandSellerBlank from "@vardast/asset/brand-seller-blank.svg"
import CardAvatar from "@vardast/component/CardAvatar"
import FavoriteIcon from "@vardast/component/FavoriteIcon"
import ShareIcon from "@vardast/component/ShareIcon"
import {
  EntityTypeEnum,
  File,
  GetBrandQuery,
  GetIsFavoriteQuery,
  IndexProductInput
} from "@vardast/graphql/generated"
import {
  setBreadCrumb,
  setPageHeader
} from "@vardast/provider/LayoutProvider/use-layout"
import { getBrandQueryFn } from "@vardast/query/queryFns/brandQueryFns"
import { getIsFavoriteQueryFns } from "@vardast/query/queryFns/getIsFavoriteQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import clsx from "clsx"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import CategoriesTab from "@/app/(client)/brand/components/CategoryTab"

import PdfTabItem from "./PdfTabItem"
import ProductsTab from "./ProductsTab"

export interface IBrandOrSellerProfile {
  limitPage?: number
  isMobileView: boolean
  slug: Array<string | number>
  args: IndexProductInput
  session: Session | null
}

export enum BrandProfileTabEnum {
  // eslint-disable-next-line no-unused-vars
  PRODUCT = "PRODUCT",
  // eslint-disable-next-line no-unused-vars
  CATEGORY = "CATEGORY",
  // eslint-disable-next-line no-unused-vars
  SELLERS = "SELLERS",
  // eslint-disable-next-line no-unused-vars
  PRICE_LIST = "PRICE_LIST",
  // eslint-disable-next-line no-unused-vars
  CATALOG = "CATALOG"
}

export const sortContainerClass = clsx("flex items-center justify-between")

export const TotalItemsReport = ({
  total,
  title
}: {
  total?: string | number
  title: string
}) => {
  return (
    <div className="flex items-center justify-start gap-x-2 px pt text-sm font-semibold text-primary">
      <span className="text-alpha-400">تعداد {title}:</span>
      {total ? digitsEnToFa(`${total}`) : "..."}
    </div>
  )
}

const BrandProfile = ({ isMobileView, args, slug }: IBrandOrSellerProfile) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState<BrandProfileTabEnum>(
    (searchParams.get("tab") as BrandProfileTabEnum) ||
      BrandProfileTabEnum.PRODUCT
  )
  const brandQuery = useQuery<GetBrandQuery>(
    [QUERY_FUNCTIONS_KEY.BRAND_QUERY_KEY, { id: +slug[0] }],
    () => getBrandQueryFn({ id: +slug[0] }),
    {
      keepPreviousData: true
    }
  )

  const isFavoriteQuery = useQuery<GetIsFavoriteQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_IS_FAVORITE,
      {
        entityId: +slug[0],
        type: EntityTypeEnum.Brand
      }
    ],
    () =>
      getIsFavoriteQueryFns({
        accessToken: session?.accessToken,
        entityId: +slug[0],
        type: EntityTypeEnum.Brand
      }),
    {
      keepPreviousData: true,
      enabled: !!session
    }
  )

  const PageHeader = (
    <div className="w-full md:flex md:gap-6">
      <div className="relative flex flex-col justify-start overflow-hidden md:w-80 md:min-w-80 md:flex-shrink-0 md:justify-center md:rounded-2xl md:border">
        <div className="flex  flex-col gap-y bg-alpha-white md:h-auto md:min-h-full ">
          <div className="flex h-full flex-col items-center justify-center gap-y bg-alpha-white">
            {isMobileView && (
              <div className="relative flex aspect-square h-[calc(56vw)] max-h-[calc(56vw)] min-h-[calc(56vw)] w-full flex-col items-center justify-center">
                <Image
                  src={brandQuery?.data?.brand?.bannerMobile?.presignedUrl?.url}
                  alt="seller"
                  fill
                  className="h-full w-full md:rounded-full"
                />
              </div>
            )}

            <div className="flex w-full grid-cols-2 justify-between px-6 pb-6 pt-2 md:grid md:!p-0">
              <div className=" flex items-center justify-center gap-2 md:col-span-2 md:flex-col md:gap-7 md:py-9">
                <CardAvatar
                  size={isMobileView ? "small" : "medium"}
                  url={
                    brandQuery?.data?.brand?.logoFile?.presignedUrl?.url
                      ? brandQuery?.data?.brand?.logoFile?.presignedUrl?.url
                      : brandSellerBlank
                  }
                />
                {/* <div className="flex h-20 w-20 flex-col items-center justify-center overflow-hidden rounded-full border-2 md:h-36  md:!min-h-36 md:w-36">
                  <Image
                    alt="logo"
                    width={100}
                    height={100}
                    src={
                      brandQuery?.data?.brand?.logoFile?.presignedUrl?.url
                        ? brandQuery?.data?.brand?.logoFile?.presignedUrl?.url
                        : brandSellerBlank
                    }
                  />
                </div> */}
                <h1 className="text-base font-semibold">
                  {brandQuery?.data?.brand?.name}
                </h1>
              </div>

              <div className="col-span-2 flex grid-cols-2 gap-5 md:grid md:gap-0 md:divide-x md:divide-x-reverse md:border-t md:py-3">
                <FavoriteIcon
                  type={EntityTypeEnum.Brand}
                  entityId={+slug[0]}
                  isFavoriteQuery={isFavoriteQuery}
                />
                <ShareIcon name={brandQuery?.data?.brand.name} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isMobileView && (
        <div className="relative hidden aspect-auto w-full overflow-hidden rounded-2xl border md:col-span-9 md:block">
          <Image
            src={
              brandQuery?.data?.brand.bannerDesktop?.presignedUrl.url
                ? `${brandQuery?.data?.brand?.bannerDesktop?.presignedUrl.url}`
                : brandSellerBlank
            }
            className="h-full w-full object-cover"
            alt="banner"
            fill
          />
        </div>
      )}
    </div>
  )

  setPageHeader(PageHeader)
  setBreadCrumb([
    {
      label: t("common:brands"),
      path: "/brands",
      isCurrent: false
    },
    {
      label: brandQuery?.data?.brand?.name,
      path: `${`brands/${brandQuery?.data?.brand?.id}`}`,
      isCurrent: true
    }
  ])
  return (
    <div className="flex flex-col">
      <Tabs
        value={activeTab}
        className="flex h-full w-full flex-col bg-alpha-white"
        onValueChange={(e) => setActiveTab(e as BrandProfileTabEnum)}
      >
        <TabsList className="sticky top-0 z-50 grid w-full grid-cols-4 bg-alpha-white font-medium sm:z-0 md:mb-6  md:flex">
          <TabsTrigger className="py-4" value={BrandProfileTabEnum.PRODUCT}>
            {t("common:products")}
          </TabsTrigger>
          <TabsTrigger className="py-4" value={BrandProfileTabEnum.CATEGORY}>
            {t("common:category")}
          </TabsTrigger>
          {/* <TabsTrigger className="py-4" value={BrandProfileTabEnum.SELLERS}>
      {t("common:sellers")}
    </TabsTrigger> */}
          <TabsTrigger className="py-4" value={BrandProfileTabEnum.CATALOG}>
            {t("common:catalog")}
          </TabsTrigger>
          <TabsTrigger className="py-4" value={BrandProfileTabEnum.PRICE_LIST}>
            {t("common:price_list")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={BrandProfileTabEnum.PRODUCT}>
          <ProductsTab
            productsProps={{
              args,
              isMobileView,
              session,
              slug
            }}
          />
        </TabsContent>
        <TabsContent value={BrandProfileTabEnum.CATEGORY}>
          <CategoriesTab
            brandName={brandQuery.data?.brand.name}
            productsProps={{
              args,
              isMobileView,
              session,
              slug
            }}
          />
        </TabsContent>
        <TabsContent value={BrandProfileTabEnum.CATALOG}>
          <PdfTabItem
            access_token={session?.accessToken}
            title="کاتالوگ"
            file={brandQuery.data?.brand.catalog as File}
          />
        </TabsContent>
        <TabsContent value={BrandProfileTabEnum.PRICE_LIST}>
          <PdfTabItem
            access_token={session?.accessToken}
            title="لیست قیمت"
            file={brandQuery.data?.brand.priceList as File}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BrandProfile
