import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { IndexProductInput } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import AllProductsIndexPage from "@/app/(seller)/products/all-products/AllProductsIndexPage"

type SearchIndexProps = {
  params: { slug: Array<string | number> }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function ManageProductPage({
  params: { slug }
  // searchParams
}: SearchIndexProps) {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()
  const args: IndexProductInput = {}
  // args["page"] =
  //   searchParams.page && +searchParams.page[0] > 0 ? +searchParams.page[0] : 1

  // if (slug && slug.length) args["categoryIds"] = [+slug[0]]

  // if (searchParams.query && searchParams.query.length)
  //   args["query"] = searchParams.query as string

  // if (searchParams.orderBy) {
  //   args["orderBy"] = searchParams.orderBy as ProductSortablesEnum
  // } else {
  //   args["orderBy"] = ProductSortablesEnum.Newest
  // }

  // args["attributes"] = []

  // args["query"] = ""

  // if (searchParams) {
  //   for (const key in searchParams) {
  //     if (key.includes("attributes[")) {
  //       const regex = /attributes\[(\d+)\]/
  //       const match = key.match(regex)

  //       if (match && match.length === 2) {
  //         const id = parseInt(match[1], 10)
  //         const value: string[] = Array.isArray(searchParams[key])
  //           ? (searchParams[key] as string[])
  //           : ([searchParams[key]] as string[])

  //         value.forEach((val) => {
  //           args["attributes"]?.push({ id, value: val })
  //         })
  //       }
  //     }
  //   }
  // }

  // await queryClient.prefetchInfiniteQuery(
  //   [QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY, args],
  //   () => getAllProductsQueryFn(args)
  // )

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <AllProductsIndexPage
        slug={slug}
        args={args}
        isMobileView={isMobileView}
      />
    </ReactQueryHydrate>
  )
}

export default withMobileHeader(ManageProductPage, {
  title: "کالاهای وردست",
  hasBack: true
})
