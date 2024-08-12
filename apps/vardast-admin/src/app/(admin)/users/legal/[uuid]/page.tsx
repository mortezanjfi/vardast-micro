import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import LegalPage from "@/app/(admin)/users/legal/[uuid]/components/LegalPage"

export async function generateMetadata(): Promise<Metadata> {
  // parent: ResolvingMetadata
  return {
    title: "ویرایش کاربر حقوقی"
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
      <LegalPage uuid={uuid} />
    </ReactQueryHydrate>
  )
}

export default BrandEditPage
