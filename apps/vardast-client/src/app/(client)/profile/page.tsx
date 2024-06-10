import { Metadata } from "next"
import { redirect } from "next/navigation"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import ProfilePageIndex from "./components/ProfilePageIndex"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "حساب کاربری"
  }
}

export default async () => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)

  if (isMobileView) {
    return (
      <ReactQueryHydrate state={dehydratedState}>
        <ProfilePageIndex />
      </ReactQueryHydrate>
    )
  }
  redirect("/profile/info")
}
