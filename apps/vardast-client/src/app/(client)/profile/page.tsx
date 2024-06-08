import { Metadata } from "next"
import { redirect } from "next/navigation"
import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import ProfileIndex from "./components"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "حساب کاربری"
  }
}

export default async () => {
  const isMobileView = await CheckIsMobileView()
  const session = await getServerSession(authOptions)
  const queryClient = getQueryClient()

  if (!session?.accessToken) {
    redirect("/auth/signin")
  }

  const dehydratedState = dehydrate(queryClient)

  if (isMobileView) {
    return (
      <ReactQueryHydrate state={dehydratedState}>
        <ProfileIndex />
      </ReactQueryHydrate>
    )
  }
  redirect("/profile/info")
}
