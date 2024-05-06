"use client"

import { useQuery } from "@tanstack/react-query"
import Breadcrumb from "@vardast/component/Breadcrumb"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import {
  GetSellerQuery,
  IndexProductInput,
  Seller
} from "@vardast/graphql/generated"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getSellerQueryFn } from "@vardast/query/queryFns/sellerQueryFns"
import { useSession } from "next-auth/react"

import SellerHeader from "@/app/(public)/(purchaser)/seller/components/seller-header"
import ProductList from "@/app/components/product-list"

interface SellerPageProps {
  isMobileView: boolean
  slug: Array<string | number>
  args: IndexProductInput
}

const SellerPage = ({ isMobileView, args, slug }: SellerPageProps) => {
  const { data: session } = useSession()
  const sellerQuery = useQuery<GetSellerQuery>(
    [QUERY_FUNCTIONS_KEY.SELLER_QUERY_KEY, { id: +slug[0] }],
    () => getSellerQueryFn({ id: +slug[0], accessToken: session?.accessToken }),
    {
      keepPreviousData: true
    }
  )

  if (sellerQuery.isLoading) return <Loading />
  if (sellerQuery.error) return <LoadingFailed />
  if (!sellerQuery.data) return <NoResult entity="brand" />

  return (
    <>
      <div>
        <Breadcrumb
          dynamic={false}
          items={[
            { label: "فروشندگان وردست", path: "/sellers", isCurrent: false },
            {
              label: sellerQuery?.data.seller.name,
              path: `/seller/${sellerQuery?.data.seller.id}/${sellerQuery?.data.seller.name}`,
              isCurrent: true
            }
          ]}
        />
      </div>

      <SellerHeader seller={sellerQuery?.data.seller as Seller} />

      <ProductList
        args={args}
        isMobileView={isMobileView}
        selectedCategoryIds={args["categoryIds"] || undefined}
        sellerId={+slug[0]}
      />
    </>
  )
}

export default SellerPage
