import { Metadata } from "next"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import HomeIndex from "@/app/(client)/(home)/components/HomeIndex"

export const metadata: Metadata = {
  title: "بازار آنلاین مصالح ساختمانی",
  description: process.env.NEXT_PUBLIC_SLOGAN
}

const Index = async () => {
  const isMobileView = await CheckIsMobileView()
  // const session = await getServerSession(authOptions)
  // const queryClient = getQueryClient()

  // await queryClient.prefetchQuery(
  //   [QUERY_FUNCTIONS_KEY.GET_ALL_BRANDS_COUNT_QUERY_KEY],
  //   getAllBrandsCountQueryFn
  // )
  // await queryClient.prefetchQuery(
  //   [QUERY_FUNCTIONS_KEY.ALL_SELLERS_COUNT_QUERY_KEY],
  //   getAllSellersCountQueryFn
  // )

  // await queryClient.prefetchQuery(
  //   [
  //     QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
  //     {
  //       page: 1
  //     }
  //   ],
  //   () =>
  //     getAllProductsQueryFn({
  //       page: 1
  //     })
  // )

  // await queryClient.prefetchQuery(
  //   [QUERY_FUNCTIONS_KEY.BANNER_HOME_PAGE_KEY, FileModelTypeEnum.Slider],
  //   () => bannerHomePageQueryFns({ type: FileModelTypeEnum.Slider })
  // )

  // await queryClient.prefetchQuery(
  //   [QUERY_FUNCTIONS_KEY.GET_ALL_BLOGS, { page: 1 }],
  //   () => getAllBlogsQueryFn({ page: 1 })
  // )

  // await queryClient.prefetchQuery({
  //   queryKey: [
  //     QUERY_FUNCTIONS_KEY.VOCABULARY_QUERY_KEY,
  //     { slug: "product_categories" }
  //   ],
  //   queryFn: () => getVocabularyQueryFn("product_categories")
  // })

  // const dehydratedState = dehydrate(queryClient)
  return (
    // <ReactQueryHydrate state={dehydratedState}>
    <HomeIndex isMobileView={isMobileView} />
    // </ReactQueryHydrate>
  )
}

export default withMobileHeader(Index, {
  hasLogo: true
})
