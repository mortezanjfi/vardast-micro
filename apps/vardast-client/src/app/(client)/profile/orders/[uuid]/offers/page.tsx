import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import OrderOffers from "@/app/(client)/profile/orders/[uuid]/offers/components/OrderOffers"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پیشنهاد قیمت"
  }
}

const Page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <OrderOffers uuid={uuid} />
    </ReactQueryHydrate>
  )
}

export default Page
