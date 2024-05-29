"use client"

import OrderInfoForm from "@/app/(client)/(profile)/profile/orders/[uuid]/info/components/OrderInfoForm"

type OrderInfoPageProps = { isMobileView: boolean; uuid: string }

const OrderInfoPage = ({ isMobileView, uuid }: OrderInfoPageProps) => {
  return <OrderInfoForm isMobileView={isMobileView} uuid={uuid} />
}

export default OrderInfoPage
