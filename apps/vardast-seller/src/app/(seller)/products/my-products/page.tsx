import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { SearchSellerRepresentativeInput } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getMyProfileSellerQueryFns } from "@vardast/query/queryFns/getMyProfileSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import ProductsPage from "@/app/(seller)/products/components/products-page"
import { SellerDesktopMyProducts } from "@/app/(seller)/products/components/SellerDesktopMyProducts"

type SearchIndexProps = {
  params: { slug: Array<string | number> }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function MyProductsPage({ params: { slug } }: SearchIndexProps) {
  const isMobileView = CheckIsMobileView()
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
          <ProductsPage
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

export default withMobileHeader(MyProductsPage, {
  title: "مدیریت کالاهای من",
  hasBack: true
})
