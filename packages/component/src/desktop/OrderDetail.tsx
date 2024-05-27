"use client"

import { ReactNode } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { FindPreOrderByIdQuery } from "@vardast/graphql/generated"

import OrderInfoCard from "./OrderInfoCard"
import OrderProductsList from "./OrderProductsList"

export enum OrderDetailPageType {
  SELLER_ORDERS_DETAIL = "SELLER_ORDERS_DETAIL",
  ADMIN_ORDER_DETAIL_PAGE = "ADMIN_ORDER_DETAIL_PAGE",
  SELLER_MY_ORDERS_DETAIL = "SELLER_MY_ORDERS_DETAIL",
  SELLER_ADD_OFFER_PRICE_PAGE = "  SELLER_ADD_OFFER_PRICE_PAGE"
}

type Props = {
  uuid?: string
  isAdmin?: boolean
  type: OrderDetailPageType
  AddOfferChildren?: ReactNode
  SellerChildren?: ReactNode
  Adminchildren?: ReactNode
  findPreOrderByIdQuery: UseQueryResult<FindPreOrderByIdQuery, unknown>
  SellerAddOfferPriceChildren?: ReactNode
}
const fakeData = [
  {
    id: 3,
    product_sku: "Innovative AI Development",
    productName: "test",
    brand: "test brand",
    unit: "60",
    value: 4,
    attributes: ["test", "test2"],
    purchaserPrice: { basePrice: 300, tax: 40, total: 340 }
  }
]
const OrderDetail: React.FC<Props> = ({
  uuid,
  SellerAddOfferPriceChildren,
  type,
  Adminchildren,
  AddOfferChildren,
  SellerChildren,
  findPreOrderByIdQuery
}) => {
  return (
    <div className="flex w-full flex-col gap-9">
      <OrderInfoCard
        findPreOrderByIdQuery={findPreOrderByIdQuery}
        uuid={uuid}
      />
      <OrderProductsList data={fakeData} />
      {type === OrderDetailPageType.SELLER_ORDERS_DETAIL && SellerChildren}
      {type === OrderDetailPageType.ADMIN_ORDER_DETAIL_PAGE && Adminchildren}
      {type === OrderDetailPageType.SELLER_ADD_OFFER_PRICE_PAGE &&
        SellerAddOfferPriceChildren}

      {type === OrderDetailPageType.SELLER_MY_ORDERS_DETAIL && AddOfferChildren}
    </div>
  )
}

export default OrderDetail
