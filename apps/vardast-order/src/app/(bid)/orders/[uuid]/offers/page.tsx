import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import OffersPage from "@vardast/component/offers/OffersPage"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پیشنهاد قیمت"
  }
}

export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const queryClient = getQueryClient()
  const isMobileView = await CheckIsMobileView()
  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <OffersPage uuid={uuid} isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}
