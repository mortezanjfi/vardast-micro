import type { Metadata } from "next"
import { dehydrate } from "@tanstack/query-core"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import ProductsPage from "@/app/(admin)/products/components/ProductsPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "کالاها"
  }
}

export default async () => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)
  return (
    <ReactQueryHydrate state={dehydratedState}>
      <ProductsPage title={(await generateMetadata()).title?.toString()} />
    </ReactQueryHydrate>
  )
}
