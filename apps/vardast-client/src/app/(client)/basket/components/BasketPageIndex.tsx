"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Loading from "@vardast/component/Loading"
import {
  EntityTypeEnum,
  GetUserFavoriteProductsQuery
} from "@vardast/graphql/generated"
import { allUserFavoriteProductsQueryFns } from "@vardast/query/queryFns/allUserFavoriteProductsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { useSession } from "next-auth/react"

import { ProductsTabContent } from "@/app/(client)/favorites/components/ProductsTabContent"

const BasketPageIndex = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cacheFlag, setCacheFlag] = useState(false)
  const productQuery = useQuery<GetUserFavoriteProductsQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_PRODUCT,
      EntityTypeEnum.Basket
    ],
    queryFn: () =>
      allUserFavoriteProductsQueryFns({ accessToken: session?.accessToken }),
    refetchOnWindowFocus: true,
    enabled: !!session
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin/basket")
    } else if (!cacheFlag) {
      productQuery.refetch()
      setCacheFlag(true)
    }

    return () => {
      setCacheFlag(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === "authenticated") {
    return <ProductsTabContent session={session} productQuery={productQuery} />
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loading message="لطفا منتظر بمانید..." />
    </div>
  )
}

export default BasketPageIndex
