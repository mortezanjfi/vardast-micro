"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Loading from "@vardast/component/Loading"
import {
  EntityTypeEnum,
  GetUserFavoriteProductsQuery
} from "@vardast/graphql/generated"
import paths from "@vardast/lib/paths"
import { allUserFavoriteProductsQueryFns } from "@vardast/query/queryFns/allUserFavoriteProductsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { useSession } from "next-auth/react"

import { ProductsTabContent } from "@/app/(client)/profile/favorites/components/ProductsTabContent"

const BasketPageIndex = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cacheFlag, setCacheFlag] = useState(false)
  const productQuery = useQuery<GetUserFavoriteProductsQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_PRODUCT,
      EntityTypeEnum.Basket,
      session?.accessToken
    ],
    queryFn: () =>
      allUserFavoriteProductsQueryFns({
        type: EntityTypeEnum.Basket,
        accessToken: session?.accessToken
      }),
    refetchOnWindowFocus: true,
    enabled: !!session
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`${paths.signin}?ru=/basket`)
    } else if (!cacheFlag) {
      productQuery.refetch()
      setCacheFlag(true)
    }

    return () => {
      setCacheFlag(false)
    }
  }, [])

  if (status === "authenticated") {
    return <ProductsTabContent productQuery={productQuery} session={session} />
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loading message="لطفا منتظر بمانید..." />
    </div>
  )
}

export default BasketPageIndex
