// import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
"use client"

import { useGetOneLegalQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

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
    <div></div>
    // <AddressesTab
    //   relatedType="Legal"
    //   relatedId={+uuid}
    //   addresses={getOnLegal?.data?.findOneLegal?.addresses as Address[]}
    // />
  )
}
