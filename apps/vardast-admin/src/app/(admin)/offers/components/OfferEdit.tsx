"use client"

import { notFound } from "next/navigation"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import { Offer, useGetOfferQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import OfferForm from "@/app/(admin)/offers/components/OfferForm"

type Props = {
  uuid: string
}

const OfferEdit = ({ uuid }: Props) => {
  const { isLoading, error, data } = useGetOfferQuery(
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

  return <OfferForm offer={data.offer as Offer} />
}

export default OfferEdit
