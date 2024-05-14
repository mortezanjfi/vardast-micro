import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getAllFaqQueryFns } from "@vardast/query/queryFns/getAllFaqQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import Faq from "@/app/(client)/(profile)/faq/components/Faq"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سوالات متداول"
  }
}

const ContactPage = async () => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(
    [QUERY_FUNCTIONS_KEY.GET_ALL_FAQ],
    getAllFaqQueryFns
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <Faq isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(ContactPage, {
  title: "سوالات متداول"
})
