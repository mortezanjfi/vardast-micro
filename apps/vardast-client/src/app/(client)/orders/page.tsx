import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import ClientOrdersIndex from "@/app/(client)/orders/ClientOrdersIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات"
  }
}

const CategoryIdPage = async () => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <ClientOrdersIndex />
    </ReactQueryHydrate>
  )
}

export default CategoryIdPage
