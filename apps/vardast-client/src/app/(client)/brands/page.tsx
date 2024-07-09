import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import BrandsPage from "@vardast/component/brand/brands-page"
import { IndexBrandInput, SortBrandEnum } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getAllBrandsQueryFn } from "@vardast/query/queryFns/allBrandsQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

interface BrandsIndexProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "برندها"
  }
}

const BrandsIndex = async ({ searchParams }: BrandsIndexProps) => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  const args: IndexBrandInput = {}

  args["page"] =
    searchParams.page && +searchParams.page[0] > 0 ? +searchParams.page[0] : 1
  if (searchParams.query && searchParams.query.length)
    args["name"] = searchParams.query as string
  args["name"] = ""
  args["orderBy"] = searchParams.sortType as SortBrandEnum

  await queryClient.prefetchInfiniteQuery(
    [QUERY_FUNCTIONS_KEY.GET_ALL_BRANDS_QUERY_KEY, args],
    () => getAllBrandsQueryFn(args)
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <BrandsPage
        // hasSearch
        limitPage={5}
        args={args}
        isMobileView={isMobileView}
      />
    </ReactQueryHydrate>
  )
}

export default BrandsIndex
