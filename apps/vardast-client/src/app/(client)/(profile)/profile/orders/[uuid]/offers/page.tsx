import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderOffers from "@/app/(client)/(profile)/profile/orders/[uuid]/offers/components/OrderOffers"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پیشنهاد قیمت"
  }
}

const Page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const queryClient = getQueryClient()
  const isMobileView = await CheckIsMobileView()
  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <OrderOffers isMobileView={isMobileView} uuid={uuid} />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(Page, { title: "پیشنهاد قیمت" })
