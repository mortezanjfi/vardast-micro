import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import UsersPage from "@/app/(admin)/users/real/components/UsersPage"

export async function generateMetadata(): Promise<Metadata> {
  // parent: ResolvingMetadata
  return {
    title: "کاربران حقیقی"
  }
}
export default async () => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)
  return (
    <ReactQueryHydrate state={dehydratedState}>
      <UsersPage
        title={(await generateMetadata()).title?.toString() as string}
      />
    </ReactQueryHydrate>
  )
}
