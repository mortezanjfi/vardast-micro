"use client"

import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import { Brand, useGetBrandQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import BrandForm from "@/app/(admin)/brands/components/OldBrandForm"

type Props = {
  uuid: string
}

const BrandEdit = ({ uuid }: Props) => {
  const { isLoading, error, data } = useGetBrandQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    },
    {
      staleTime: 1000
    }
  )

  if (isLoading) return <Loading />
  if (error) return <LoadingFailed />
  if (!data) notFound()

  return <BrandForm brand={data.brand as Brand} />
}

export default BrandEdit
