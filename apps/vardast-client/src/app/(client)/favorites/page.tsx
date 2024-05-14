import { Metadata } from "next"
import { redirect } from "next/navigation"
import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { EntityTypeEnum } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { allUserFavoriteBrandsQueryFns } from "@vardast/query/queryFns/allUserFavoriteBrandsQueryFns"
import { allUserFavoriteProductsQueryFns } from "@vardast/query/queryFns/allUserFavoriteProductsQueryFns"
import { allUserFavoriteSellersQueryFns } from "@vardast/query/queryFns/allUserFavoriteSellersQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import FavoritesPageIndex from "@/app/(client)/favorites/components/FavoritesPageIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "علاقه مندی ها"
  }
}

const FavoritePage = async () => {
  const queryClient = getQueryClient()
  const isMobileView = await CheckIsMobileView()
  const session = await getServerSession(authOptions)

  if (!!session) {
    await queryClient.prefetchQuery(
      [
        QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_PRODUCT,
        EntityTypeEnum.Product
      ],
      () =>
        allUserFavoriteProductsQueryFns({
          accessToken: session?.accessToken
        })
    )

    await queryClient.prefetchQuery(
      [QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_SELLER, EntityTypeEnum.Seller],
      () =>
        allUserFavoriteSellersQueryFns({
          accessToken: session?.accessToken
        })
    )

    await queryClient.prefetchQuery(
      [QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_BRAND, EntityTypeEnum.Brand],
      () =>
        allUserFavoriteBrandsQueryFns({
          accessToken: session?.accessToken
        })
    )
  }

  // if (!session) redirect("/auth/signin/favorites")

  const dehydratedState = dehydrate(queryClient)

  if (!isMobileView) {
    redirect("/")
  }
  return (
    <ReactQueryHydrate state={dehydratedState}>
      <FavoritesPageIndex isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(FavoritePage, { title: "علاقه‌مندی‌ها" })
