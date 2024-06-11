"use client"

import OrderInfoForm from "./OrderInfoForm"

export type OrderInfoPageProps = {
  isMobileView: boolean
  uuid?: string
}

const OrderInfoPage = async ({ isMobileView, uuid }: OrderInfoPageProps) => {
  return <OrderInfoForm isMobileView={isMobileView} uuid={uuid} />
}

export default OrderInfoPage
