import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { IndexBrandInput } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getMyProfileBrandsSellerQueryFns } from "@vardast/query/queryFns/getMyProfileBrandsSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import BrandsPage from "@/app/(seller)/brands/components/brands-page"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "برندها"
  }
}

const BrandsIndex = async () => {
  const isMobileView = await CheckIsMobileView()
  const session = await getServerSession(authOptions)
  const queryClient = getQueryClient()

  const args: IndexBrandInput = {}

  await queryClient.prefetchQuery(
    [QUERY_FUNCTIONS_KEY.GET_MY_PROFILE_BRANDS_SELLERS],
    () =>
      getMyProfileBrandsSellerQueryFns({ accessToken: session?.accessToken })
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <BrandsPage session={session} args={args} isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(BrandsIndex, {
  title: "برندها",
  hasBack: true
})
