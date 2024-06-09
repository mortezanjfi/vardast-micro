import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import ProjectsPage from "@/app/(client)/profile/projects/components/project/ProjectsPage"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پروژه ها"
  }
}

export default async () => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <ProjectsPage
        isMobileView={isMobileView}
        title={(await generateMetadata()).title?.toString() as string}
      />
    </ReactQueryHydrate>
  )
}
