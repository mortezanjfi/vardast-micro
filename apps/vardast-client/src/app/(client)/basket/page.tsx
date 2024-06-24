import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import { EntityTypeEnum } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { allUserFavoriteProductsQueryFns } from "@vardast/query/queryFns/allUserFavoriteProductsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getServerSession } from "next-auth"

import BasketPageIndex from "@/app/(client)/basket/components/BasketPageIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سبد کالا"
  }
}

export default async () => {
  const queryClient = getQueryClient()
  const session = await getServerSession(authOptions)

  if (!!session) {
    await queryClient.prefetchQuery(
      [
        QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_PRODUCT,
        EntityTypeEnum.Basket,
        session?.accessToken
      ],
      () =>
        allUserFavoriteProductsQueryFns({
          type: EntityTypeEnum.Basket,
          accessToken: session?.accessToken
        })
    )
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <BasketPageIndex />
    </ReactQueryHydrate>
  )
}
