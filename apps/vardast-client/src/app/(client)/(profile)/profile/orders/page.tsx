import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrdersPage from "@/app/(client)/(profile)/profile/orders/components/OrdersPage"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات"
  }
}

const Page = async () => {
  const queryClient = getQueryClient()
  const dehydratedState = dehydrate(queryClient)
  const isMobileView = await CheckIsMobileView()

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <OrdersPage
        isMobileView={isMobileView}
        title={(await generateMetadata()).title?.toString() as string}
      />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(Page, { title: "سفارشات" })
