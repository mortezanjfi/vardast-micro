import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import {
  EntityTypeEnum,
  IndexProductInput,
  ProductSortablesEnum
} from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/allProductsQueryFns"
import { getIsFavoriteQueryFns } from "@vardast/query/queryFns/getIsFavoriteQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getSellerQueryFn } from "@vardast/query/queryFns/sellerQueryFns"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import SellerProfile from "@/app/(client)/seller/components/SellerProfile"

interface SellerIndexProps {
  params: {
    slug: Array<string | number>
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: SellerIndexProps
  // parent: ResolvingMetadata
): Promise<Metadata> {
  if (params?.slug?.at(0)) {
    try {
      const sellerId = params.slug[0] as number
      const seller = await getSellerQueryFn({ id: sellerId })

      return {
        title: seller.seller.name,
        alternates: {
          canonical: encodeURI(
            `${process.env.NEXTAUTH_URL}/seller/${seller.seller.id}/${seller.seller.name}`
          )
        }
      }
    } catch (error) {
      console.log("generateMetadata seller")
    }

    return {
      title: "فروشنده یافت نشد"
    }
  }
  return {
    title: "فروشنده وردست"
  }
}

const SellerIndex = async ({
  params: { slug },
  searchParams
}: SellerIndexProps) => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()
  const session = await getServerSession(authOptions)

  const args: IndexProductInput = {}
  args["page"] =
    searchParams.page && +searchParams.page[0] > 0 ? +searchParams.page[0] : 1
  if (slug && slug.length) args["sellerId"] = +slug[0]
  if (searchParams.query && searchParams.query.length)
    args["query"] = searchParams.query as string

  if (searchParams.categoryId && searchParams.categoryId.length)
    args["categoryIds"] = Array.isArray(searchParams.categoryId)
      ? searchParams.categoryId.map((item) => +item)
      : [+searchParams.categoryId]

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

  await queryClient.prefetchQuery(
    [QUERY_FUNCTIONS_KEY.SELLER_QUERY_KEY, { id: +slug[0] }],
    () => getSellerQueryFn({ id: +slug[0], accessToken: session?.accessToken })
  )

  await queryClient.prefetchInfiniteQuery(
    [
      QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
      {
        page: 1,
        sellerId: +slug[0]
      }
    ],
    () =>
      getAllProductsQueryFn({
        page: 1,
        sellerId: +slug[0]
      })
  )

  if (session) {
    await queryClient.prefetchQuery(
      [
        QUERY_FUNCTIONS_KEY.GET_IS_FAVORITE,
        {
          entityId: +slug[0],
          type: EntityTypeEnum.Seller
        }
      ],
      () =>
        getIsFavoriteQueryFns({
          accessToken: session?.accessToken,
          entityId: +slug[0],
          type: EntityTypeEnum.Seller
        })
    )
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <SellerProfile
        isMobileView={isMobileView}
        args={args}
        slug={slug}
        session={session}
      />
    </ReactQueryHydrate>
  )
}

export default SellerIndex
