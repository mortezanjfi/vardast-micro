import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import { authOptions } from "@vardast/auth/authOptions"
import { EntityTypeEnum } from "@vardast/graphql/generated"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getIsFavoriteQueryFns } from "@vardast/query/queryFns/getIsFavoriteQueryFns"
import { getProductQueryFn } from "@vardast/query/queryFns/productQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { getServerSession } from "next-auth"

import ProductPage from "@/app/(client)/product/components/ProductPage"

interface ProductIndexProps {
  params: {
    slug: Array<string | number>
  }
}
const productPageTitle = process.env.NEXT_PUBLIC_PRODUCT_TITLE

export async function generateMetadata(
  { params }: ProductIndexProps
  // parent: ResolvingMetadata
): Promise<Metadata> {
  if (params?.slug?.at(0)) {
    try {
      const id = params.slug[0] as number
      // const slug = params.slug[1] as string
      const data = await getProductQueryFn(id)

      return {
        title: `${productPageTitle} ${data.product.name || data.product.title}`,
        description: data.product.metaDescription,
        alternates: {
          canonical: encodeURI(
            `${process.env.NEXTAUTH_URL}/product/${data.product.id}/${data.product.name}`
          )
        }
      }
    } catch (error) {
      console.log("generateMetadata product")
    }

    return {
      title: "محصولی یافت نشد"
    }
  }
  return {
    title: "محصول وردست"
  }
}

const ProductIndex = async ({ params: { slug } }: ProductIndexProps) => {
  const isMobileView = await CheckIsMobileView()
  const session = await getServerSession(authOptions)
  const id = slug[0] as number
  // const pSlug = slug[1] as string

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    [QUERY_FUNCTIONS_KEY.PRODUCT_QUERY_KEY, { id: +id }],
    () => getProductQueryFn(id)
  )

  if (session?.accessToken) {
    await queryClient.prefetchQuery(
      [
        QUERY_FUNCTIONS_KEY.GET_IS_FAVORITE,
        {
          entityId: +slug[0],
          type: EntityTypeEnum.Product,
          accessToken: session?.accessToken
        }
      ],
      () =>
        getIsFavoriteQueryFns({
          accessToken: session?.accessToken,
          entityId: +slug[0],
          type: EntityTypeEnum.Product
        })
    )
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <ProductPage id={id} isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}

export default ProductIndex
