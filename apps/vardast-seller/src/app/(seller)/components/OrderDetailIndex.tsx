"use client"

import OrderDetail, {
  OrderDetailPageType
} from "@vardast/component/desktop/OrderDetail"
import { useFindPreOrderByIdQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import AddToMyOrders from "@/app/(seller)/components/AddToMyOrders"

type Props = { uuid: string }

function OrderDetailIndex({ uuid }: Props) {
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )
  return (
    <OrderDetail
      uuid={uuid}
      findPreOrderByIdQuery={findPreOrderByIdQuery}
      SellerChildren={<AddToMyOrders />}
      type={OrderDetailPageType.SELLER_ORDERS_DETAIL}
      SellerAddOfferPriceChildren={""}
    />
  )
}

export default OrderDetailIndex
