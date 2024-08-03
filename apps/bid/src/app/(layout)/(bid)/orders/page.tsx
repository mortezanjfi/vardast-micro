import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { Metadata } from "next"

import OrdersPage from "@/app/(layout)/(bid)/orders/components/OrdersPage"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات"
  }
}

export default async () => {
  const queryClient = getQueryClient()
  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <OrdersPage />
    </ReactQueryHydrate>
  )
}
