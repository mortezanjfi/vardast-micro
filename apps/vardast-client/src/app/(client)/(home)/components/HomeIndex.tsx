"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
  FileModelTypeEnum,
  GetAllBlogsQuery,
  GetAllBrandsCountQuery,
  GetAllProductsQuery,
  GetAllSellersCountQuery,
  GetBannerHomePageQuery,
  GetVocabularyQuery
} from "@vardast/graphql/generated"
import { getAllBrandsCountQueryFn } from "@vardast/query/queryFns/allBrandsCountQueryFns"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/allProductsQueryFns"
import { getAllSellersCountQueryFn } from "@vardast/query/queryFns/allSellersCountQueryFns"
import { bannerHomePageQueryFns } from "@vardast/query/queryFns/bannerHomePageQueryFns"
import { getAllBlogsQueryFn } from "@vardast/query/queryFns/getAllBlogsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getVocabularyQueryFn } from "@vardast/query/queryFns/vocabularyQueryFns"

import DesktopHomeIndex from "@/app/(client)/(home)/components/DesktopHomeIndex"
import MobileHomeIndex from "@/app/(client)/(home)/components/MobileHomeIndex"

const PwaNotificationProvider = dynamic(
  () => import("@vardast/component/PwaNotification"),
  {
    ssr: false
  }
)

export type IHomeProps = {
  isMobileView: boolean
  allProductsQuery: UseQueryResult<GetAllProductsQuery, unknown>
  homeSlidersQuery: UseQueryResult<GetBannerHomePageQuery, unknown>
  allSellersCount: UseQueryResult<GetAllSellersCountQuery>
  allBrandsCount: UseQueryResult<GetAllBrandsCountQuery>
  getVocabularyQueryFcQuery: UseQueryResult<GetVocabularyQuery>
  getAllBlogsQuery: UseQueryResult<GetAllBlogsQuery>
  // session: Session | null
}

type HomeIndexProps = {
  isMobileView: boolean
  // session: Session | null
}

const HomeIndex = ({ isMobileView }: HomeIndexProps) => {
  const allProductsQuery = useQuery<GetAllProductsQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
      {
        page: 1
      }
    ],
    () =>
      getAllProductsQueryFn({
        page: 1
      }),
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const getVocabularyQueryFcQuery = useQuery<GetVocabularyQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.VOCABULARY_QUERY_KEY,
      { slug: "product_categories" }
    ],
    queryFn: () => getVocabularyQueryFn("product_categories"),
    keepPreviousData: true,
    staleTime: 999999999
  })

  const allBrandsCount = useQuery<GetAllBrandsCountQuery>(
    [QUERY_FUNCTIONS_KEY.GET_ALL_BRANDS_COUNT_QUERY_KEY],
    getAllBrandsCountQueryFn,
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const allSellersCount = useQuery<GetAllSellersCountQuery>(
    [QUERY_FUNCTIONS_KEY.ALL_SELLERS_COUNT_QUERY_KEY],
    getAllSellersCountQueryFn,
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const homeSlidersQuery = useQuery<GetBannerHomePageQuery>(
    [QUERY_FUNCTIONS_KEY.BANNER_HOME_PAGE_KEY, FileModelTypeEnum.Slider],
    () => bannerHomePageQueryFns({ type: FileModelTypeEnum.Slider }),
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const getAllBlogsQuery = useQuery<GetAllBlogsQuery>(
    [QUERY_FUNCTIONS_KEY.GET_ALL_BLOGS, { page: 1 }],
    () => getAllBlogsQueryFn({ page: 1 }),
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  const homeProps: IHomeProps = useMemo(
    () => ({
      // session,
      isMobileView,
      allProductsQuery,
      homeSlidersQuery,
      allSellersCount,
      allBrandsCount,
      getVocabularyQueryFcQuery,
      getAllBlogsQuery
    }),
    [
      // session
      isMobileView,
      allProductsQuery,
      homeSlidersQuery,
      allSellersCount,
      allBrandsCount,
      getVocabularyQueryFcQuery,
      getAllBlogsQuery
    ]
  )

  return (
    <>
      <PwaNotificationProvider isMobileView={isMobileView} />
      {isMobileView ? (
        <MobileHomeIndex {...homeProps} />
      ) : (
        <DesktopHomeIndex {...homeProps} />
      )}
    </>
  )
}

export default HomeIndex
