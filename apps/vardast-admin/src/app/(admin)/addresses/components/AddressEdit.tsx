"use client"

import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import { Address, useGetAddressQuery } from "@vardast/graphql/generated"
import graphqlRequestClientAdmin from "@vardast/query/queryClients/graphqlRequestClientWhitToken"

import AddressForm from "@/app/(admin)/addresses/components/AddressForm"

type AddressEditProps = {
  uuid: string
  fallback: string
}

const AddressEdit = ({ uuid, fallback }: AddressEditProps) => {
  const { isLoading, error, data } = useGetAddressQuery(
    graphqlRequestClientAdmin,
    {
      id: +uuid
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()

  return (
    <AddressForm passedAddress={data.address as Address} fallback={fallback} />
  )
}

export default AddressEdit
