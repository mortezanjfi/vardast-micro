"use client"

import OrderInfoForm from "./OrderInfoForm"

type OrderInfoPageProps = { isMobileView: boolean; uuid: string }

const OrderInfoPage = async ({ isMobileView, uuid }: OrderInfoPageProps) => {
  return <OrderInfoForm isMobileView={isMobileView} uuid={uuid} />
}

export default OrderInfoPage
