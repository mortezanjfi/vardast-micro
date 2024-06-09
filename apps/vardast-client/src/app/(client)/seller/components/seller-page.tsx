"use client"

import { useQuery } from "@tanstack/react-query"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import ProductList from "@vardast/component/product-list"
import {
  GetSellerQuery,
  IndexProductInput,
  Seller
} from "@vardast/graphql/generated"
import { setBreadCrumb } from "@vardast/provider/LayoutProvider/use-layout"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getSellerQueryFn } from "@vardast/query/queryFns/sellerQueryFns"

import SellerHeader from "@/app/(client)/seller/components/seller-header"

interface SellerPageProps {
  isMobileView: boolean
  slug: Array<string | number>
  args: IndexProductInput
}

const SellerPage = ({ isMobileView, args, slug }: SellerPageProps) => {
  const sellerQuery = useQuery<GetSellerQuery>(
    [QUERY_FUNCTIONS_KEY.SELLER_QUERY_KEY, { id: +slug[0] }],
    () => getSellerQueryFn({ id: +slug[0] }),
    {
      keepPreviousData: true
    }
  )

  if (sellerQuery.isLoading) return <Loading />
  if (sellerQuery.error) return <LoadingFailed />
  if (!sellerQuery.data) return <NoResult entity="brand" />

  setBreadCrumb({
    dynamic: false,
    items: [
      { label: "فروشندگان وردست", path: "/sellers", isCurrent: false },
      {
        label: sellerQuery?.data.seller.name,
        path: `/seller/${sellerQuery?.data.seller.id}/${sellerQuery?.data.seller.name}`,
        isCurrent: true
      }
    ]
  })

  return (
    <>
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
