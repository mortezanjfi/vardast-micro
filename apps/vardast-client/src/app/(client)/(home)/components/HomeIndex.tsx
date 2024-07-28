"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
  FileModelTypeEnum,
  GetAllBlogsQuery,
  GetAllBrandsCountQuery,
  GetAllProductsQuery,
  GetBannerHomePageQuery,
  GetPublicOrdersQuery,
  GetVocabularyQuery,
  SortDirection,
  SortFieldProduct,
  useGetPublicOrdersQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { getAllBrandsCountQueryFn } from "@vardast/query/queryFns/allBrandsCountQueryFns"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/allProductsQueryFns"
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
  publicOrdersQuery: UseQueryResult<GetPublicOrdersQuery, unknown>
  recentPriceProductsQuery: UseQueryResult<GetAllProductsQuery, unknown>
  isMobileView: boolean
  allProductsQuery: UseQueryResult<GetAllProductsQuery, unknown>
  homeSlidersQuery: UseQueryResult<GetBannerHomePageQuery, unknown>
  allBrandsCount: UseQueryResult<GetAllBrandsCountQuery>
  getVocabularyQueryFcQuery: UseQueryResult<GetVocabularyQuery>
  getAllBlogsQuery: UseQueryResult<GetAllBlogsQuery>
}

type HomeIndexProps = {
  isMobileView: boolean
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
  const recentPriceProductsQuery = useQuery<GetAllProductsQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
      {
        page: 1,
        sortField: SortFieldProduct.Price,
        sortDirection: SortDirection.Desc
      }
    ],
    () =>
      getAllProductsQueryFn({
        page: 1,
        sortField: SortFieldProduct.Price,
        sortDirection: SortDirection.Desc
      })
  )

  const publicOrdersQuery = useGetPublicOrdersQuery(
    graphqlRequestClientWithToken
  )

  const homeProps: IHomeProps = useMemo(
    () => ({
      publicOrdersQuery,
      recentPriceProductsQuery,
      isMobileView,
      allProductsQuery,
      homeSlidersQuery,
      allBrandsCount,
      getVocabularyQueryFcQuery,
      getAllBlogsQuery
    }),
    [
      publicOrdersQuery,
      recentPriceProductsQuery,
      isMobileView,
      allProductsQuery,
      homeSlidersQuery,
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
