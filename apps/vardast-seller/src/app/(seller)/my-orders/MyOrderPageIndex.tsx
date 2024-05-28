"use client"

import { useMemo } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { PreOrdersQuery, useMyPreOrdersQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import SellerOrdersPage from "@/app/(seller)/components/SellerOrdersPage"

const MyOrderPageIndex = () => {
  const myPreOrdersQuery = useMyPreOrdersQuery(
    graphqlRequestClientWithToken,
    {
      indexPreOrderInput: {
        page: 1
      }
    },
    {
      refetchOnMount: "always"
    }
  )

  const preOrdersQuery = useMemo(
    () => ({
      ...myPreOrdersQuery,
      data: {
        ...myPreOrdersQuery?.data,
        preOrders: myPreOrdersQuery?.data?.myPreOrder
      }
    }),
    [myPreOrdersQuery.data]
  ) as UseQueryResult<PreOrdersQuery, unknown>

  return (
    <SellerOrdersPage isMyOrderPage={true} preOrdersQuery={preOrdersQuery} />
  )
}

export default MyOrderPageIndex
