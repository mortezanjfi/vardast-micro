"use client"

import { useRouter } from "next/navigation"
import { useFindPreOrderByIdQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ACTION_BUTTON_TYPE } from "@vardast/type/OrderProductTabs"

import OrderProductsList from "../../../../apps/vardast-order/src/app/(bid)/orders/[uuid]/components/OrderProductsList"

type Props = {
  uuid: string
  offerId: string
  isMobileView: boolean
}

const OfferPage = ({ isMobileView, offerId, uuid }: Props) => {
  const router = useRouter()
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  return (
    <OrderProductsList
      button={{
        onClick: () => router.back(),
        text: "بازگشت",
        type: "button"
      }}
      isSeller={true}
      actionButtonType={ACTION_BUTTON_TYPE.ADD_PRODUCT_OFFER}
      isMobileView={isMobileView}
      hasOperation={true}
      offerId={offerId}
      findPreOrderByIdQuery={findPreOrderByIdQuery}
    />
  )
}

export default OfferPage
