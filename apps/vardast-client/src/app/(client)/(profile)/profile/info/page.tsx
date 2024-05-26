import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import InfoPage from "@/app/(client)/(profile)/profile/info/components/InfoPage"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "اطلاعات حساب کاربری"
  }
}

const Page = async () => {
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <InfoPage
        title={(await generateMetadata()).title?.toString() as string}
      />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(Page, { title: "اطلاعات حساب کاربری" })
