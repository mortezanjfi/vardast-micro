import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { IndexPreOrderInput, PreOrderStates } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

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
const fakeData = [
  {
    id: 3,
    projectName: "Innovative AI Development",
    personInCharge: "Jane Doe",
    dateOfSubmission: "2023-11-01",
    dateOfExpiry: "2024-11-01",
    hasFile: true,
    status: false,
    projectCode: "AI-DEV-001",
    purchaser: "Tech Solutions Inc."
  }
]

const queryClient = getQueryClient()
const dehydratedState = dehydrate(queryClient)
const page = async ({ params: { slug }, searchParams }: SearchIndexProps) => {
  const args: IndexPreOrderInput = {}

  if (searchParams.status) {
    args["status"] = searchParams.orderBy as PreOrderStates
  } else {
    args["status"] = undefined
  }

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <AllPreOrders args={args} />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(page, { title: "سفارشات" })
