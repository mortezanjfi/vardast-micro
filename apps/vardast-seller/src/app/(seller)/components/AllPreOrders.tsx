"use client"

import { useState } from "react"
import {
  IndexPreOrderInput,
  PreOrderStates,
  usePreOrdersQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import SellerOrdersPage from "@/app/(seller)/components/SellerOrdersPage"

type Props = { isMobileView: boolean; args: IndexPreOrderInput }

function AllPreOrders({ isMobileView, args }: Props) {
  const [filter, setFilter] = useState<PreOrderStates | undefined>(args.status)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const preOrdersQuery = usePreOrdersQuery(
    graphqlRequestClientWithToken,
    {
      indexPreOrderInput: {
        page: currentPage,
        status: filter || undefined
      }
    },
    {
      refetchOnMount: "always"
    }
  )

  return (
    <SellerOrdersPage
      goToOffers={false}
      isMobileView={isMobileView}
      filter={filter}
      setFilter={setFilter}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      preOrdersQuery={preOrdersQuery}
    />
  )
}

export default AllPreOrders
