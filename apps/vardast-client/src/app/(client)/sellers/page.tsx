import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { IndexSellerInput } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getAllSellersQueryFn } from "@vardast/query/queryFns/allSellersQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import SellersPage from "@/app/(client)/sellers/components/sellers-page"

interface SellersIndexProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "فروشندگان"
  }
}

const SellersIndex = async ({ searchParams }: SellersIndexProps) => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  const args: IndexSellerInput = {}

  args["page"] =
    searchParams.page && +searchParams.page[0] > 0 ? +searchParams.page[0] : 1
  if (searchParams.query && searchParams.query.length)
    args["name"] = searchParams.query as string
  args["name"] = ""
  await queryClient.prefetchInfiniteQuery(
    [QUERY_FUNCTIONS_KEY.ALL_SELLERS_QUERY_KEY, args],
    () => getAllSellersQueryFn(args)
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <SellersPage
        // hasSearch
        limitPage={5}
        args={args}
        isMobileView={isMobileView}
      />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(SellersIndex, {
  title: "فروشندگان"
})
