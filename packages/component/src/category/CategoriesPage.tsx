"use client"

import { useState } from "react"
import { notFound, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { GetCategoryQuery, IndexProductInput } from "@vardast/graphql/generated"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import useTranslation from "next-translate/useTranslation"

import Link from "../Link"
import ProductList from "../product-list"
import SearchHeader from "../search-header"
import CategoriesList from "./CategoriesList"

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

  //args needed fot products tab to pass as porps------->
  const args: IndexProductInput = {}
  if (categoryId && categoryId.length > 0) args["categoryIds"] = [+categoryId]

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
        <TabsList className="grid w-full grid-cols-4 border-b md:flex">
          <TabsTrigger value={CATEGORY_PAGE_TABS.SUBCATEGORIES}>
            {t(`common:${CATEGORY_PAGE_TABS.SUBCATEGORIES}`)}
          </TabsTrigger>
          <TabsTrigger value={CATEGORY_PAGE_TABS.ORDERS}>
            {t(`common:${CATEGORY_PAGE_TABS.ORDERS}`)}
          </TabsTrigger>
          <TabsTrigger value={CATEGORY_PAGE_TABS.BRANDS}>
            {t(`common:${CATEGORY_PAGE_TABS.BRANDS}`)}
          </TabsTrigger>
          <TabsTrigger value={CATEGORY_PAGE_TABS.PRODUCTS}>
            {t(`common:${CATEGORY_PAGE_TABS.PRODUCTS}`)}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="bg-alpha-50"
          value={CATEGORY_PAGE_TABS.SUBCATEGORIES}
        >
          <CategoriesList
            data={categoryQuery?.data?.category.children}
            isLoading={categoryQuery.isLoading}
            isSubcategory
            isMobileView={isMobileView}
          />
        </TabsContent>
        <TabsContent value={CATEGORY_PAGE_TABS.ORDERS}></TabsContent>
        <TabsContent value={CATEGORY_PAGE_TABS.BRANDS}></TabsContent>
        <TabsContent value={CATEGORY_PAGE_TABS.PRODUCTS}>
          <ProductList
            isMobileView={true}
            args={args}
            selectedCategoryIds={[+categoryId]}
          />
        </TabsContent>
      </Tabs>
      {categoryQuery?.data?.category.description && (
        <>
          <div className="flex flex-col gap-y bg-alpha-white p">
            <h4 className="text-alpha-500">معرفی</h4>
            <div className={`${more ? "" : "line-clamp-2"}`}>
              {categoryQuery?.data?.category.description
                .split("\n\n")
                .map((paragraph, index) => (
                  <p key={index} className="text-justify text-sm leading-6">
                    {paragraph}
                  </p>
                ))}
            </div>
            <Link
              className="text-left text-primary"
              // onClick={() => {
              //   setMore(!more)
              // }}
              href={categoryQuery?.data?.category.url || ""}
            >
              {more ? "کمتر" : "بیشتر"}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default CategoriesPage
