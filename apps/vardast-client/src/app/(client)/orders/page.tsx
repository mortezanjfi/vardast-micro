import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import ClientOrdersIndex from "@/app/(client)/orders/ClientOrdersIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات"
  }
}

const CategoryIdPage = async () => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <ClientOrdersIndex isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}

export default CategoryIdPage
