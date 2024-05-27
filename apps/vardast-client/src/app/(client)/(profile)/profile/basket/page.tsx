import { Metadata } from "next"
import { redirect } from "next/navigation"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سبد خرید"
  }
}

const Page = async () => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  if (isMobileView) {
    redirect("/profile")
  }

  const dehydratedState = dehydrate(queryClient)

  return <ReactQueryHydrate state={dehydratedState}>basket</ReactQueryHydrate>
}

export default withMobileHeader(Page, { title: "سبد خرید" })
