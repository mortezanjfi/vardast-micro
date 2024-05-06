"use client"

import { notFound } from "next/navigation"
import graphqlRequestClientAdmin from "@/graphqlRequestClientAdmin"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import { Uom, useGetUomQuery } from "@vardast/graphql/generated"

import UOMForm from "@/app/(admin)/uoms/components/UOMForm"

type Props = {
  uuid: string
}

const UOMEdit = ({ uuid }: Props) => {
  const { isLoading, error, data } = useGetUomQuery(
    graphqlRequestClientAdmin,
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

  return <UOMForm uom={data.uom as Uom} />
}

export default UOMEdit
