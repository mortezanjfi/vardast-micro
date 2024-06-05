"use client"

import OrderInfoForm from "@/app/(client)/profile/orders/[uuid]/info/components/OrderInfoForm"

type OrderInfoPageProps = { uuid: string }

const OrderInfoPage = ({ uuid }: OrderInfoPageProps) => {
  return <OrderInfoForm uuid={uuid} />
}

export default OrderInfoPage
