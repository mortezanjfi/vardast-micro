"use client"

import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
// import useTranslation from "next-translate/useTranslation"

import { Attribute, useGetAttributeQuery } from "@vardast/graphql/generated"
import graphqlRequestClientAdmin from "@vardast/query/queryClients/graphqlRequestClientWhitToken"

import AttributeForm from "@/app/(admin)/attributes/components/AttributeForm"

type Props = {
  uuid: string
  categoryId?: string
}

const AttributeEdit = ({ uuid, categoryId }: Props) => {
  // const { t } = useTranslation()
  const { isLoading, error, data } = useGetAttributeQuery(
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

  return (
    <AttributeForm
      attribute={data.attribute as Attribute}
      categoryId={categoryId}
    />
  )
}

export default AttributeEdit
