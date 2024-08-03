import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import LinesPage from "@/app/(layout)/(bid)/lines/components/LinesPage"

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
      <LinesPage />
    </ReactQueryHydrate>
  )
}
