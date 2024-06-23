// import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
"use client"

import { Address, useGetOneLegalQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import AddressesTab from "./AddressesTab"

export type UserBaseInfoPageProps = {
  uuid?: string
}

export default ({ uuid }: UserBaseInfoPageProps) => {
  const getOnLegal = useGetOneLegalQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    { refetchOnMount: "always" }
  )

  return (
    <AddressesTab
      relatedType="Legal"
      relatedId={+uuid}
      addresses={getOnLegal?.data?.findOneLegal?.addresses as Address[]}
    />
  )
}
