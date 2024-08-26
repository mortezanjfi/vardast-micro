import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import LegalsPage from "@/app/(admin)/users/legal/components/LegalsPage"

export async function generateMetadata(): Promise<Metadata> {
  // parent: ResolvingMetadata
  return {
    title: "کاربران حقوقی"
  }
}
export default async () => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)
  return (
    <ReactQueryHydrate state={dehydratedState}>
      <LegalsPage
        title={(await generateMetadata()).title?.toString()}
      />
    </ReactQueryHydrate>
  )
}
