"use client"

import OrderInfoForm from "@/app/(client)/profile/orders/[uuid]/info/components/OrderInfoForm"

type OrderInfoPageProps = { isMobileView: boolean; uuid: string }

const OrderInfoPage = async ({ isMobileView, uuid }: OrderInfoPageProps) => {
  return <OrderInfoForm isMobileView={isMobileView} uuid={uuid} />
}

export default OrderInfoPage
