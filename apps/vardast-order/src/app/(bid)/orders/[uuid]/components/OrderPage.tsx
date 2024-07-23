"use client"

import OrderOffers from "@/app/(bid)/orders/[uuid]/offers/components/OrderOffers"
import OrderProductsList from "@/app/(bid)/orders/[uuid]/products/components/OrderProductsList"
import OrderInfoCard from "@/app/(bid)/orders/components/OrderInfoCard"

type OrderPageProps = {
  uuid: string
}

const OrderPage = ({ uuid }: OrderPageProps) => {
  return (
    <>
      <OrderInfoCard uuid={uuid} />
      <OrderProductsList uuid={uuid} />
      <OrderOffers uuid={uuid} />
    </>
  )
}

export default OrderPage
