import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getMyProfileCategoriesSellerQueryFns } from "@vardast/query/queryFns/getMyProfileCategoriesSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getServerSession } from "next-auth"

import CategoriesPage from "@/app/(seller)/categories/components/categories-page"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "دسته‌بندی‌ها"
  }
}

const CategoriesIndex = async () => {
  const session = await getServerSession(authOptions)
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(
    [QUERY_FUNCTIONS_KEY.GET_MY_PROFILE_CATEGORIES_SELLERS],
    () =>
      getMyProfileCategoriesSellerQueryFns({
        accessToken: session?.accessToken
      })
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <CategoriesPage session={session} />
    </ReactQueryHydrate>
  )
}

export default CategoriesIndex
