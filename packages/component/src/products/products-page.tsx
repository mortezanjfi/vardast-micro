"use client"

import { useQuery } from "@tanstack/react-query"
import {
  GetCategoryQuery,
  GetCategoryQueryVariables,
  IndexProductInput
} from "@vardast/graphql/generated"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { clsx } from "clsx"

import DesktopCategoriesCardsSection from "../category/DesktopCategoriesCardsSection"
import MobileCategoriesCardSection from "../category/MobileCategoriesCardSection"
import ProductDescription from "../product-description"
import ProductList from "../product-list"
import ProductsHeader from "../search-header"

interface ProductsPageProps {
  needCategoryFilterSection?: boolean
  isMobileView: boolean
  slug: (string | number)[]
  args: IndexProductInput
  hasSearch?: boolean
  isSellerPanel?: boolean
}

const ProductsPage = ({
  needCategoryFilterSection = false,
  isMobileView,
  slug,
  args,
  hasSearch,
  isSellerPanel
}: ProductsPageProps) => {
  args.categoryIds = slug && slug.length > 0 ? [+slug[0]] : []

  const categoryArgs: GetCategoryQueryVariables = {}

  const getCategoryQuery = useQuery<GetCategoryQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.CATEGORY_QUERY_KEY, categoryArgs],
    queryFn: () => getCategoryQueryFn(args.categoryIds[0])
  })

  // args["categoryIds"] = getCategoryQuery.data?.category?.children?.length
  //   ? getCategoryQuery.data.category.children.map((children) => {
  //       return children?.id as number
  //     })
  //   : [selectedCategoryId]

  return (
    <>
      {slug && slug.length > 0 ? (
        <ProductsHeader
          isMobileView={isMobileView}
          selectedCategoryId={+slug[0]}
        />
      ) : null}

      <div className={clsx("flex flex-col gap-9", isMobileView && "!gap-0")}>
        {isMobileView && args.categoryIds.length ? (
          <MobileCategoriesCardSection
            getCategoryQuery={getCategoryQuery}
            slug={slug}
          />
        ) : (
          <DesktopCategoriesCardsSection
            getCategoryQuery={getCategoryQuery}
            selectedCategoryId={args.categoryIds[0]}
          />
        )}

        <ProductList
          needCategoryFilterSection={needCategoryFilterSection}
          hasSearch={hasSearch}
          isSellerPanel={isSellerPanel}
          isMobileView={isMobileView}
          args={args}
          limitPage={args.categoryIds.length ? undefined : 5}
        />
        {getCategoryQuery.data?.category.description && (
          <div>
            <ProductDescription
              description={getCategoryQuery.data?.category.description}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ProductsPage
