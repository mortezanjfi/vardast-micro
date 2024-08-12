"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Loading from "@vardast/component/Loading"
import NotFoundIcon from "@vardast/component/not-found-icon"
import {
  EntityTypeEnum,
  GetUserFavoriteBrandsQuery,
  GetUserFavoriteProductsQuery,
  GetUserFavoriteSellersQuery
} from "@vardast/graphql/generated"
import paths from "@vardast/lib/paths"
import { allUserFavoriteBrandsQueryFns } from "@vardast/query/queryFns/allUserFavoriteBrandsQueryFns"
import { allUserFavoriteProductsQueryFns } from "@vardast/query/queryFns/allUserFavoriteProductsQueryFns"
import { allUserFavoriteSellersQueryFns } from "@vardast/query/queryFns/allUserFavoriteSellersQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import BrandsTabContent from "@/app/(client)/profile/favorites/components/BrandsTabContent"
import { ProductsTabContent } from "@/app/(client)/profile/favorites/components/ProductsTabContent"
import { SellersTabContent } from "@/app/(client)/profile/favorites/components/SellersTabContent"

export const NotFoundItems = ({ text = "کالا" }) => {
  return (
    <div className="flex flex-col justify-start gap-y-1">
      <NotFound text={text} />
      <NotFoundItemsHelp text={text} />
    </div>
  )
}

const NotFound = ({ text = "کالا" }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-7 bg-alpha-white px-6 py-10">
      <NotFoundIcon />
      <p className="text-center text-alpha-500">
        {`شما هنوز ${text} به لیست علاقمندی‌ها اضافه نکرده اید!`}
      </p>
    </div>
  )
}

const NotFoundItemsHelp = ({ text = "کالا" }) => {
  return (
    <div className="grid w-full grid-cols-6 items-center justify-center border-t-2 bg-alpha-white px-6 py-10">
      <div className="col-span-5 flex flex-col justify-evenly gap-y-1">
        <p className="text-right">نشان کنید!</p>
        <p className="text-right text-sm text-alpha-500">
          {`لیست دلخواه خود را بسازید و به راحتی ${text}های مورد نظر خود را پیدا
          کنید.`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-12 w-12">
          <Image
            src="/favorite-gif.gif"
            alt="favorite-gif"
            fill
            className="object-fill"
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  )
}
export enum FAVORITE_PAGE_TABS {
  PRODUCTS = "products",
  BRANDS = "brands",
  SELLERS = "sellers"
}
const FavoritesPageIndex = ({ isMobileView }: { isMobileView: boolean }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useTranslation()
  const [cacheFlag, setCacheFlag] = useState(false)
  const [activeTab, setActiveTab] = useState<FAVORITE_PAGE_TABS>(
    FAVORITE_PAGE_TABS.PRODUCTS
  )
  const productQuery = useQuery<GetUserFavoriteProductsQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_PRODUCT,
      EntityTypeEnum.Product
    ],
    queryFn: () =>
      allUserFavoriteProductsQueryFns({ accessToken: session?.accessToken }),
    refetchOnWindowFocus: true,
    enabled: !!session
  })
  const brandQuery = useQuery<GetUserFavoriteBrandsQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_BRAND,
      EntityTypeEnum.Brand
    ],
    queryFn: () =>
      allUserFavoriteBrandsQueryFns({ accessToken: session?.accessToken }),
    refetchOnWindowFocus: true,
    enabled: !!session
  })

  const sellerQuery = useQuery<GetUserFavoriteSellersQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_SELLER,
      EntityTypeEnum.Seller
    ],
    queryFn: () =>
      allUserFavoriteSellersQueryFns({ accessToken: session?.accessToken }),
    refetchOnWindowFocus: true,
    enabled: !!session
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`${paths.signin}?ru=/profile/favorites`)
    } else if (!cacheFlag) {
      brandQuery.refetch()
      sellerQuery.refetch()
      productQuery.refetch()
      setCacheFlag(true)
    }

    return () => {
      setCacheFlag(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === "authenticated") {
    return (
      <Tabs
        value={activeTab}
        onValueChange={(e) => setActiveTab(e as FAVORITE_PAGE_TABS)}
        className="flex h-full w-full flex-col bg-alpha-white"
      >
        <TabsList className="sticky top-0 z-50 grid w-full auto-cols-auto grid-flow-col bg-alpha-white font-medium sm:z-0  md:flex">
          <TabsTrigger
            className="whitespace-nowrap py-4"
            value={FAVORITE_PAGE_TABS.PRODUCTS}
          >
            {t(`common:${FAVORITE_PAGE_TABS.PRODUCTS}`)}
          </TabsTrigger>

          <TabsTrigger
            className="whitespace-nowrap py-4"
            value={FAVORITE_PAGE_TABS.BRANDS}
          >
            {t(`common:${FAVORITE_PAGE_TABS.BRANDS}`)}
          </TabsTrigger>
          <TabsTrigger
            className="whitespace-nowrap py-4"
            value={FAVORITE_PAGE_TABS.SELLERS}
          >
            {t(`common:${FAVORITE_PAGE_TABS.SELLERS}`)}
          </TabsTrigger>
          {/* for full border under tabs-----------? */}
          {!isMobileView && (
            <div className="w-full border-b-0.5 border-alpha-200"></div>
          )}
        </TabsList>

        <TabsContent value={FAVORITE_PAGE_TABS.PRODUCTS}>
          <ProductsTabContent session={session} productQuery={productQuery} />
        </TabsContent>
        <TabsContent value={FAVORITE_PAGE_TABS.BRANDS}>
          <BrandsTabContent brandQuery={brandQuery} />
        </TabsContent>
        <TabsContent value={FAVORITE_PAGE_TABS.SELLERS}>
          <SellersTabContent sellerQuery={sellerQuery} />
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loading message="لطفا منتظر بمانید..." />
    </div>
  )
}

export default FavoritesPageIndex
