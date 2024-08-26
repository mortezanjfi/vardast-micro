"use client"

import { notFound } from "next/navigation"
import AddressForm from "@vardast/component/desktop/AddressForm"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import { Address, useGetAddressQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

type AddressEditProps = {
  uuid: string
  fallback: string
}

const AddressEdit = ({ uuid, fallback }: AddressEditProps) => {
  const { isLoading, error, data } = useGetAddressQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()

  return (
    <AddressForm fallback={fallback} passedAddress={data.address as Address} />
  )
}

export default AddressEdit
