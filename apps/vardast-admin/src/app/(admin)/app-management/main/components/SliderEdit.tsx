"use client"

import { Banner, useFindOneBannerQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import SliderForm from "@/app/(admin)/app-management/main/components/SliderForm"

type Props = { uuid: string }

function SliderEdit({ uuid }: Props) {
  const findOneSLiderQuery = useFindOneBannerQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  return (
    <SliderForm slider={findOneSLiderQuery?.data?.findOneBanner as Banner} />
  )
}

export default SliderEdit
