import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import ProjectForm from "@/app/(client)/(profile)/profile/projects/components/ProjectForm"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "افزودن پروژه"
  }
}

const ProfilePage = async () => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  // if (!isMobileView) {
  //   redirect("/")
  // }

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      {!isMobileView && (
        <ProjectForm
          title={(await generateMetadata()).title?.toString() as string}
        />
      )}
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(ProfilePage, { title: "افزودن پروژه" })
