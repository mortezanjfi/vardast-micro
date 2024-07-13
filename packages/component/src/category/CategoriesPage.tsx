"use client"

import { useState } from "react"
import { notFound, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  GetAllBlogsQuery,
  GetCategoryQuery,
  IndexBrandInput,
  IndexProductInput,
  useGetPublicOrdersQuery
} from "@vardast/graphql/generated"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import { getAllBlogsQueryFn } from "@vardast/query/queryFns/getAllBlogsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import useTranslation from "next-translate/useTranslation"

import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"
import BrandsList from "../brand/BrandsList"
import ProductList from "../product-list"
import SearchHeader from "../search-header"
import CategoriesList from "./CategoriesList"
import CategoriesPublicOrders from "./CategoriesPublicOrders"

export enum CATEGORY_PAGE_TABS {
  SUBCATEGORIES = "subCategories",
  ORDERS = "orders",
  BRANDS = "brands",
  PRODUCTS = "products"
}
interface CategoriesPageProps {
  categoryId: string
  isMobileView: boolean
}

const CategoriesPage = ({ categoryId, isMobileView }: CategoriesPageProps) => {
  const { t } = useTranslation()
  const [showBrand, setShowBrand] = useState<boolean>(true)
  const [more] = useState(false)
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<CATEGORY_PAGE_TABS>(
    (searchParams.get("tab") as CATEGORY_PAGE_TABS) ||
      CATEGORY_PAGE_TABS.SUBCATEGORIES
  )

  const categoryQuery = useQuery<GetCategoryQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.CATEGORY_QUERY_KEY, { id: categoryId }],
    queryFn: () => getCategoryQueryFn(+categoryId)
  })
  //public preOrders------------>
  const publicPreOrders = useGetPublicOrdersQuery(
    graphqlRequestClientWithToken,
    {
      indexPublicOrderInput: {
        categoryId: +categoryId,
        number: 15
      }
    }
  )

  //blog---------------->
  const getAllBlogsQuery = useQuery<GetAllBlogsQuery>(
    [QUERY_FUNCTIONS_KEY.GET_ALL_BLOGS, { page: 1 }],
    () => getAllBlogsQueryFn({ page: 1, categoryId: +categoryId }),
    {
      keepPreviousData: true,
      staleTime: 999999999
    }
  )

  //args need for products tab------->
  const productArgs: IndexProductInput = {}
  if (categoryId && categoryId.length > 0)
    productArgs["categoryIds"] = [+categoryId]

  //args need for brands tab-------->
  const brandsArgs: IndexBrandInput = {}
  if (categoryId && categoryId.length > 0)
    brandsArgs["categoryId"] = +categoryId

  if (!categoryQuery) {
    // return <NoProductFound />
    return notFound()
  }

  return (
    <div className="flex flex-col">
      {isMobileView ? (
        <SearchHeader
          selectedCategoryId={categoryId as unknown as number}
          isMobileView={isMobileView}
        />
      ) : null}
      <Tabs
        value={activeTab}
        onValueChange={(e) => setActiveTab(e as CATEGORY_PAGE_TABS)}
        className="flex h-full w-full flex-col bg-alpha-white"
      >
        <TabsList className="sticky top-0 z-50 grid w-full grid-cols-4 bg-alpha-white font-medium sm:z-0 sm:border-b-0.5 md:flex">
          <TabsTrigger
            className="py-4"
            value={CATEGORY_PAGE_TABS.SUBCATEGORIES}
          >
            {t(`common:${CATEGORY_PAGE_TABS.SUBCATEGORIES}`)}
          </TabsTrigger>
          {publicPreOrders?.data?.publicOrders?.length > 0 && (
            <TabsTrigger className="py-4" value={CATEGORY_PAGE_TABS.ORDERS}>
              {t(`common:${CATEGORY_PAGE_TABS.ORDERS}`)}
            </TabsTrigger>
          )}
          {showBrand && (
            <TabsTrigger className="py-4" value={CATEGORY_PAGE_TABS.BRANDS}>
              {t(`common:${CATEGORY_PAGE_TABS.BRANDS}`)}
            </TabsTrigger>
          )}
          <TabsTrigger className="py-4" value={CATEGORY_PAGE_TABS.PRODUCTS}>
            {t(`common:${CATEGORY_PAGE_TABS.PRODUCTS}`)}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="bg-alpha-50 sm:bg-alpha-white"
          value={CATEGORY_PAGE_TABS.SUBCATEGORIES}
        >
          {categoryQuery?.data?.category?.children.length > 0 ? (
            <CategoriesList
              categoryId={categoryId}
              getAllBlogsQuery={getAllBlogsQuery}
              description={categoryQuery?.data?.category?.description}
              data={categoryQuery?.data?.category.children}
              isLoading={categoryQuery.isLoading}
              isSubcategory
              isMobileView={isMobileView}
            />
          ) : (
            ""
          )}
        </TabsContent>
        <TabsContent className="sm:pt-5" value={CATEGORY_PAGE_TABS.ORDERS}>
          <CategoriesPublicOrders
            publicPreOrders={publicPreOrders}
            isMobileView={isMobileView}
            categoryId={categoryId}
          />
        </TabsContent>
        <TabsContent className="sm:pt-5" value={CATEGORY_PAGE_TABS.BRANDS}>
          <BrandsList
            setShowBrand={setShowBrand}
            args={brandsArgs}
            isMobileView={isMobileView}
          />
        </TabsContent>
        <TabsContent className="sm:pt-5" value={CATEGORY_PAGE_TABS.PRODUCTS}>
          <ProductList
            isMobileView={isMobileView}
            args={productArgs}
            selectedCategoryIds={[+categoryId]}
          />
        </TabsContent>
      </Tabs>
      {/* <BrandsList args={brandsArgs} isMobileView={isMobileView} /> */}
    </div>
  )
}

export default CategoriesPage
