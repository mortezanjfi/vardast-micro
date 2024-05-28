"use client"

import OrderOffers, {
  OrderOffersPageType
} from "@vardast/component/desktop/OrderOffers"
import {
  PreOrderStates,
  useFindPreOrderByIdQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import AddToMyOrders from "@/app/(seller)/components/AddToMyOrders"

type Props = { uuid: string }

function OrderOffersIndex({ uuid }: Props) {
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )
  return (
    <OrderOffers
      uuid={uuid}
      findPreOrderByIdQuery={findPreOrderByIdQuery}
      SellerChildren={
        findPreOrderByIdQuery?.data?.findPreOrderById?.status ===
        PreOrderStates.Closed ? (
          <></>
        ) : (
          <AddToMyOrders />
        )
      }
      type={OrderOffersPageType.SELLER_ORDERS_OFFERS}
      SellerAddOfferPriceChildren={""}
    />
  )
}

export default OrderOffersIndex
