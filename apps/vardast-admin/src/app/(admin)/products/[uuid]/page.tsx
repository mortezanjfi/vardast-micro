import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import ProductPage from "@/app/(admin)/products/[uuid]/components/ProductPage"

export async function generateMetadata(): Promise<Metadata> {
  // parent: ResolvingMetadata
  return {
    title: "ویرایش کالا"
  }
}
const BrandEditPage = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)
  return (
    <ReactQueryHydrate state={dehydratedState}>
      <ProductPage uuid={uuid} />
    </ReactQueryHydrate>
  )
}

export default BrandEditPage
