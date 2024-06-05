import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"

import InfoPage from "@/app/(client)/profile/info/components/InfoPage"

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

export default Page

// import { Metadata } from "next"
// import { dehydrate } from "@tanstack/react-query"
// import withLayout from "@vardast/component/hoc/withLayout"
// import layout_options from "@vardast/lib/layout_options"
// import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
// import getQueryClient from "@vardast/query/queryClients/getQueryClient"

// import InfoPage from "@/app/(client)/(profile)/profile/info/components/InfoPage"

// // set dynamic metadata
// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: "اطلاعات حساب کاربری"
//   }
// }

// export default withLayout(async () => {
//   const queryClient = getQueryClient()
//   const title = (await generateMetadata()).title?.toString() as string

//   const dehydratedState = dehydrate(queryClient)

//   return {
//     Main: () => (
//       <ReactQueryHydrate state={dehydratedState}>
//         <InfoPage title={title} />
//       </ReactQueryHydrate>
//     )
//   }
// }, layout_options._profile)
