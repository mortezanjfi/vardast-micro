import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getCountTotalEventQueryFns } from "@vardast/query/queryFns/getCountTotalEventQueryFns"
import { getMyProfileSellerQueryFns } from "@vardast/query/queryFns/getMyProfileSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import SellerHomeIndex from "@/app/(seller)/(home)/components/SellerHomeIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پنل فروشندگان وردست"
  }
}

const SellerHome = async () => {
  const session = await getServerSession(authOptions)
  const queryClient = getQueryClient()
  const isMobileView = CheckIsMobileView()

  await queryClient.prefetchQuery(
    [QUERY_FUNCTIONS_KEY.GET_M_PROFILE_SELLER],
    () =>
      getMyProfileSellerQueryFns({
        accessToken: session?.accessToken
      })
  )

  await queryClient.prefetchQuery([QUERY_FUNCTIONS_KEY.GET_COUNT_EVENT], () =>
    getCountTotalEventQueryFns(session?.accessToken)
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <ReactQueryHydrate state={dehydratedState}>
        <SellerHomeIndex session={session} isMobileView={isMobileView} />
      </ReactQueryHydrate>
    </>
  )
}

export default withMobileHeader(SellerHome, {})
