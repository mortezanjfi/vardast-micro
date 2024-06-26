import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { IndexPreOrderInput, PreOrderStates } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import AllPreOrders from "@/app/(seller)/components/AllPreOrders"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات"
  }
}
type SearchIndexProps = {
  params: { slug: Array<string | number> }
  searchParams: { [key: string]: string | string[] | undefined }
}

const queryClient = getQueryClient()
const dehydratedState = dehydrate(queryClient)
const page = async ({ params: { slug }, searchParams }: SearchIndexProps) => {
  const args: IndexPreOrderInput = {}
  const isMobileView = await CheckIsMobileView()

  if (searchParams.status) {
    args["status"] = searchParams.orderBy as PreOrderStates
  } else {
    args["status"] = undefined
  }

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <AllPreOrders isMobileView={isMobileView} args={args} />
    </ReactQueryHydrate>
  )
}

export default page
