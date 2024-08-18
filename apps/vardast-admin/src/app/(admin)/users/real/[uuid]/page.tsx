import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import UserPage from "@/app/(admin)/users/real/[uuid]/components/UserPage"

export async function generateMetadata(): Promise<Metadata> {
  // parent: ResolvingMetadata
  return {
    title: "ویرایش کاربر حقیقی"
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
      <UserPage uuid={uuid} />
    </ReactQueryHydrate>
  )
}

export default BrandEditPage
