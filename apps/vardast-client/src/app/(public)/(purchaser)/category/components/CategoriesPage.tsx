"use client"

import { notFound } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { GetCategoryQuery } from "@vardast/graphql/generated"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"

import CategoriesList from "@/app/(public)/(purchaser)/category/components/CategoriesList"
import SearchHeader from "@/app/components/search-header"

interface CategoriesListProps {
  categoryId: string
  isMobileView: boolean
}

const CategoriesPage = ({ categoryId, isMobileView }: CategoriesListProps) => {
  const { data, isLoading } = useQuery<GetCategoryQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.CATEGORY_QUERY_KEY, { id: categoryId }],
    queryFn: () => getCategoryQueryFn(+categoryId)
  })

  if (!data) {
    // return <NoProductFound />
    return notFound()
  }
  return (
    <>
      {isMobileView ? (
        <SearchHeader
          selectedCategoryId={categoryId as unknown as number}
          isMobileView={isMobileView}
        />
      ) : null}
      <CategoriesList
        data={data?.category.children}
        isLoading={isLoading}
        description={data?.category.description ?? undefined}
        href={data?.category.url ?? undefined}
        isSubcategory
      />
    </>
  )
}

export default CategoriesPage
