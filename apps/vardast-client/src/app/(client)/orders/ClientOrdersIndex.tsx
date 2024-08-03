"use client"

import CategoriesPublicOrders from "@vardast/component/category/CategoriesPublicOrders"
import { useGetPublicOrdersQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

interface ClientOrdersIndexProps {
  isMobileView: boolean
}

const ClientOrdersIndex = ({ isMobileView }: ClientOrdersIndexProps) => {
  const publicPreOrders = useGetPublicOrdersQuery(
    graphqlRequestClientWithToken,
    {
      indexPublicOrderInput: {}
    }
  )

  return (
    <CategoriesPublicOrders
      publicPreOrders={publicPreOrders}
      isMobileView={isMobileView}
    />
  )
}

export default ClientOrdersIndex
