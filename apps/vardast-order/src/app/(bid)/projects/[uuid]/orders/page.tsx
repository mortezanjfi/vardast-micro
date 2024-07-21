import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrdersPage from "@/app/(bid)/orders/components/OrdersPage"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات"
  }
}

interface ProductIndexProps {
  params: { uuid: string }
}

export default async ({ params }: ProductIndexProps) => {
  const queryClient = getQueryClient()
  const dehydratedState = dehydrate(queryClient)
  const isMobileView = await CheckIsMobileView()

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <OrdersPage isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}
