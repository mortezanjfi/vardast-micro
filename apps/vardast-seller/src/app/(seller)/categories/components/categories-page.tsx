"use client"

import { useCallback, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import CategoriesList from "@vardast/component/category/CategoriesList"
import NotFoundMessage from "@vardast/component/NotFound"
import {
  Category,
  GetMyProfileCategoriesSellerQuery
} from "@vardast/graphql/generated"
import { getMyProfileCategoriesSellerQueryFns } from "@vardast/query/queryFns/getMyProfileCategoriesSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Session } from "next-auth"

interface CategoriesListProps {
  session: Session | null
}

const CategoriesPage = ({ session }: CategoriesListProps) => {
  const { data, isLoading } = useQuery<GetMyProfileCategoriesSellerQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.GET_MY_PROFILE_CATEGORIES_SELLERS],
    queryFn: () => {
      const response = getMyProfileCategoriesSellerQueryFns({
        accessToken: session?.accessToken
      })
      return response
    },
    refetchOnMount: "always"
  })

  const getResolvedData = useCallback(() => {
    const temp: Category[] = []
    const repeatedItems: Category[] = []

    data?.myProfileSeller.myProduct.forEach((item) => {
      if (
        !temp.find((tempItem) => tempItem.id === item?.product?.category?.id)
      ) {
        temp.push(item?.product.category as Category)
      } else {
        repeatedItems.push(item?.product.category as Category)
      }
    })

    return temp
  }, [data?.myProfileSeller.myProduct])

  const resolvedData = useMemo(() => getResolvedData(), [getResolvedData])

  if (!data?.myProfileSeller?.myProduct?.length) return <NotFoundMessage />

  return (
    <CategoriesList
      data={resolvedData}
      isLoading={isLoading}
      href={undefined}
      isSubcategory
    />
  )
}

export default CategoriesPage
