"use client"

import { ReactNode } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { FindPreOrderByIdQuery } from "@vardast/graphql/generated"

import OrderProductsList from "../../../../apps/vardast-order/src/app/(bid)/orders/[uuid]/products/components/OrderProductsList"
import OrderInfoCard from "../../../../apps/vardast-order/src/app/(bid)/orders/components/OrderInfoCard"

export enum OrderOffersPageType {
  SELLER_ORDERS_OFFERS = "SELLER_ORDERS_OFFERS",
  ADMIN_ORDER_OFFERS_PAGE = "ADMIN_ORDER_OFFERS_PAGE",
  SELLER_MY_ORDERS_OFFERS = "SELLER_MY_ORDERS_OFFERS",
  SELLER_ADD_OFFER_PRICE_PAGE = "  SELLER_ADD_OFFER_PRICE_PAGE"
}

type Props = {
  isMobileView?: boolean
  offerId?: string
  isAdmin?: boolean
  type: OrderOffersPageType
  AddOfferChildren?: ReactNode
  SellerChildren?: ReactNode
  Adminchildren?: ReactNode
  findPreOrderByIdQuery: UseQueryResult<FindPreOrderByIdQuery, unknown>
  SellerAddOfferPriceChildren?: ReactNode
}

const OrderOffers: React.FC<Props> = ({
  isMobileView,
  SellerAddOfferPriceChildren,
  type,
  Adminchildren,
  AddOfferChildren,
  SellerChildren,
  findPreOrderByIdQuery
}) => {
  return (
    <div className="flex w-full flex-col gap-9">
      <OrderInfoCard findPreOrderByIdQuery={findPreOrderByIdQuery} />
      <OrderProductsList
        isMobileView={isMobileView}
        findPreOrderByIdQuery={findPreOrderByIdQuery}
        offerId={String(
          findPreOrderByIdQuery?.data?.findPreOrderById?.offers?.at(-1)?.id
        )}
      />
      {type === OrderOffersPageType.SELLER_ORDERS_OFFERS && SellerChildren}
      {type === OrderOffersPageType.ADMIN_ORDER_OFFERS_PAGE && Adminchildren}
      {type === OrderOffersPageType.SELLER_ADD_OFFER_PRICE_PAGE &&
        SellerAddOfferPriceChildren}

      {type === OrderOffersPageType.SELLER_MY_ORDERS_OFFERS && AddOfferChildren}
    </div>
  )
}

export default OrderOffers
