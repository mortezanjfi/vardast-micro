"use client"

import { useQuery } from "@tanstack/react-query"
import DesktopCategoriesCardsSection from "@vardast/component/category/DesktopCategoriesCardsSection"
import ProductDescription from "@vardast/component/product-description"
import ProductList from "@vardast/component/product-list"
import ProductsHeader from "@vardast/component/search-header"
import {
  GetCategoryQuery,
  GetCategoryQueryVariables,
  IndexProductInput
} from "@vardast/graphql/generated"
import { setBreadCrumb } from "@vardast/provider/LayoutProvider/use-layout"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import useTranslation from "next-translate/useTranslation"

interface ProductsPageProps {
  isMobileView: boolean
  slug: Array<string | number>
  args: IndexProductInput
  hasSearch?: boolean
  isSellerPanel?: boolean
}

const ProductsPage = ({
  isMobileView,
  slug,
  args,
  hasSearch,
  isSellerPanel
}: ProductsPageProps) => {
  const selectedCategoryId = slug && slug.length > 0 ? +slug[0] : 0

  const caategoryArgs: GetCategoryQueryVariables = {}
  caategoryArgs["id"] = selectedCategoryId
  const getCategoryQuery = useQuery<GetCategoryQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.CATEGORY_QUERY_KEY, caategoryArgs],
    queryFn: () => getCategoryQueryFn(selectedCategoryId)
  })
  const { t } = useTranslation()
  // args["categoryIds"] = getCategoryQuery.data?.category?.children?.length
  //   ? getCategoryQuery.data.category.children.map((children) => {
  //       return children?.id as number
  //     })
  //   : [selectedCategoryId]

  args["categoryIds"] =
    selectedCategoryId === 0
      ? []
      : getCategoryQuery.data?.category?.children?.length
        ? getCategoryQuery.data.category.children.map((children) => {
            return children?.id as number
          })
        : [selectedCategoryId]

  setBreadCrumb([
    {
      label: t("common:products_vardast"),
      path: "/products",
      isCurrent: true
    }
  ])

  return (
    <>
      {slug && slug.length > 0 ? (
        <ProductsHeader
          isMobileView={isMobileView}
          selectedCategoryId={+slug[0]}
        />
      ) : null}

      <div className="flex flex-col gap-9">
        {!isMobileView && (
          <DesktopCategoriesCardsSection
            getCategoryQuery={getCategoryQuery}
            selectedCategoryId={selectedCategoryId}
          />
        )}
        <ProductList
          hasSearch={hasSearch}
          isSellerPanel={isSellerPanel}
          isMobileView={isMobileView}
          args={args}
          selectedCategoryIds={selectedCategoryId ? [selectedCategoryId] : null}
          limitPage={selectedCategoryId ? undefined : 5}
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
