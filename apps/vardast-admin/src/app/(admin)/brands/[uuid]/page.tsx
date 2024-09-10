import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import BrandPage from "@/app/(admin)/brands/[uuid]/components/BrandPage"

export async function generateMetadata(): Promise<Metadata> {
  // parent: ResolvingMetadata
  return {
    title: "ویرایش برند"
  }
}

export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)
  return (
    <ReactQueryHydrate state={dehydratedState}>
      <BrandPage uuid={uuid} />
    </ReactQueryHydrate>
  )
}
