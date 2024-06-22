"use client"

import { useFindPreOrderByIdQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import SellersList from "./SellersList"

type Props = {
  uuid: string
  isMobileView: boolean
}

export default ({ isMobileView, uuid }: Props) => {
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )
  return (
    <SellersList
      isClient={true}
      isMobileView={isMobileView}
      uuid={uuid}
      findPreOrderByIdQuery={findPreOrderByIdQuery}
    />
  )
}
