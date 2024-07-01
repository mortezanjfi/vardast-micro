import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import OrdersPage from "@vardast/component/order/OrdersPage"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات"
  }
}

export default async () => {
  const queryClient = getQueryClient()
  const dehydratedState = dehydrate(queryClient)
  const isMobileView = await CheckIsMobileView()

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <OrdersPage isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}
