import { ReactNode } from "react"

import OrderInfoCard from "./OrderInfoCard"
import OrderProductsList from "./OrderProductsList"

export enum OrderDetailPageType {
  SELLER_ORDERS_DETAIL = "SELLER_ORDERS_DETAIL",
  ADMIN_ORDER_DETAIL_PAGE = "ADMIN_ORDER_DETAIL_PAGE",
  SELLER_MY_ORDERS_DETAIL = "SELLER_MY_ORDERS_DETAIL",
  SELLER_ADD_OFFER_PRICE_PAGE = "  SELLER_ADD_OFFER_PRICE_PAGE"
}

type Props = {
  isAdmin?: boolean
  type: OrderDetailPageType
  AddOfferChildren?: ReactNode
  SellerChildren?: ReactNode
  Adminchildren?: ReactNode
  data: any
  SellerAddOfferPriceChildren?: ReactNode
}

const OrderDetail: React.FC<Props> = ({
  SellerAddOfferPriceChildren,
  type,
  Adminchildren,
  AddOfferChildren,
  SellerChildren,
  data
}) => {
  return (
    <div className="flex w-full flex-col gap-9">
      <OrderInfoCard />
      <OrderProductsList data={data} />
      {type === OrderDetailPageType.SELLER_ORDERS_DETAIL && SellerChildren}
      {type === OrderDetailPageType.ADMIN_ORDER_DETAIL_PAGE && Adminchildren}
      {type === OrderDetailPageType.SELLER_ADD_OFFER_PRICE_PAGE &&
        SellerAddOfferPriceChildren}

      {type === OrderDetailPageType.SELLER_MY_ORDERS_DETAIL && AddOfferChildren}
    </div>
  )
}

export default OrderDetail
