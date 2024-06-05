import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import OrdersPage from "@/app/(client)/profile/orders/components/OrdersPage"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات"
  }
}

const Page = async () => {
  const queryClient = getQueryClient()
  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <OrdersPage
        title={(await generateMetadata()).title?.toString() as string}
      />
    </ReactQueryHydrate>
  )
}

export default Page
