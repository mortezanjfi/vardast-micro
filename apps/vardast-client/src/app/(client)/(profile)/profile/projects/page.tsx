import { Metadata } from "next"
import { redirect } from "next/navigation"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import ProjectsPage from "@/app/(client)/(profile)/profile/projects/components/project/ProjectsPage"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پروژه ها"
  }
}

const Page = async () => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  if (isMobileView) {
    redirect("/")
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <ProjectsPage
        title={(await generateMetadata()).title?.toString() as string}
      />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(Page, { title: "پروژه ها" })
