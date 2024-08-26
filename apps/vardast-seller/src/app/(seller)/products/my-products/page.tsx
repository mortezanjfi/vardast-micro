import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import { SearchSellerRepresentativeInput } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getMyProfileSellerQueryFns } from "@vardast/query/queryFns/getMyProfileSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import ProductsPageIndex from "@/app/(seller)/products/components/my-products-page-index"
import { SellerDesktopMyProducts } from "@/app/(seller)/products/components/SellerDesktopMyProducts"

type SearchIndexProps = {
  params: { slug: (string | number)[] }
  searchParams: Record<string, string | string[] | undefined>
}

async function MyProductsPage({ params: { slug } }: SearchIndexProps) {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()
  const session = await getServerSession(authOptions)

  const args: SearchSellerRepresentativeInput = { name: "" }

  await queryClient.prefetchQuery(
    [QUERY_FUNCTIONS_KEY.GET_M_PROFILE_SELLER, args],
    () => getMyProfileSellerQueryFns({ accessToken: session?.accessToken })
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <ReactQueryHydrate state={dehydratedState}>
        {isMobileView ? (
          <ProductsPageIndex
            session={session}
            slug={slug}
            args={args}
            isMobileView={isMobileView}
          />
        ) : (
          <SellerDesktopMyProducts session={session} />
        )}
      </ReactQueryHydrate>
    </>
  )
}

export default MyProductsPage
