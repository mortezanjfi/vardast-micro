import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import withMobileHeader from "@vardast/component/withMobileHeader"
import {
  IndexProductInput,
  ProductSortablesEnum
} from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/allProductsQueryFns"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getVocabularyQueryFn } from "@vardast/query/queryFns/vocabularyQueryFns"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import ProductsPage from "@/app/(client)/products/components/products-page"

type SearchIndexProps = {
  params: { slug: Array<string | number> }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: SearchIndexProps
  // parent: ResolvingMetadata
): Promise<Metadata> {
  if (params?.slug?.at(0)) {
    try {
      const category = await getCategoryQueryFn(+params.slug[0])

      return {
        title: category.category.title
      }
    } catch (error) {
      // throw Error("generateMetadata category")
      console.log("generateMetadata category", error)
    }

    return {
      title: "دسته بندی یافت نشد"
    }
  }
  return {
    title: "محصولات وردست"
  }
}

const SearchIndex = async ({
  params: { slug },
  searchParams
}: SearchIndexProps) => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()

  const args: IndexProductInput = {}

  args["brandId"] = searchParams.brandId ? +searchParams.brandId : undefined
  args["sellerId"] = searchParams.sellerId ? +searchParams.sellerId : undefined

  args["page"] =
    searchParams.page && +searchParams.page[0] > 0 ? +searchParams.page[0] : 1

  if (slug && slug.length) args["categoryIds"] = [+slug[0]]

  // args["query"] = ""
  if (searchParams.query && searchParams.query.length)
    args["query"] = searchParams.query as string

  if (searchParams.orderBy) {
    args["orderBy"] = searchParams.orderBy as ProductSortablesEnum
  } else {
    args["orderBy"] = ProductSortablesEnum.Newest
  }

  args["attributes"] = []

  if (searchParams) {
    for (const key in searchParams) {
      if (key.includes("attributes[")) {
        const regex = /attributes\[(\d+)\]/
        const match = key.match(regex)

        if (match && match.length === 2) {
          const id = parseInt(match[1], 10)
          const value: string[] = Array.isArray(searchParams[key])
            ? (searchParams[key] as string[])
            : ([searchParams[key]] as string[])

          value.forEach((val) => {
            args["attributes"]?.push({ id, value: val })
          })
        }
      }
    }
  }

  args["categoryIds"] = []

  if (searchParams.categoryId && searchParams.categoryId.length)
    args["categoryIds"] = Array.isArray(searchParams.categoryId)
      ? searchParams.categoryId.map((item) => +item)
      : [+searchParams.categoryId]

  await queryClient.prefetchInfiniteQuery(
    [QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY, args],
    () => getAllProductsQueryFn(args)
  )

  if (slug && slug.length) {
    await queryClient.prefetchQuery(
      [QUERY_FUNCTIONS_KEY.CATEGORY_QUERY_KEY, { id: +slug[0] }],
      () => getCategoryQueryFn(+slug[0])
    )
  } else {
    await queryClient.prefetchQuery(
      [
        QUERY_FUNCTIONS_KEY.VOCABULARY_QUERY_KEY,
        { slug: "product_categories" }
      ],
      () => getVocabularyQueryFn("product_categories")
    )
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <ProductsPage
        // hasSearch
        slug={slug}
        args={args}
        isMobileView={isMobileView}
      />
    </ReactQueryHydrate>
  )
}
export default withMobileHeader(SearchIndex, {})
