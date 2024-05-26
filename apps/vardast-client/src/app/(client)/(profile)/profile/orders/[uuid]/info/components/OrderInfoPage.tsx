"use client"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import OrderInfoForm from "@/app/(client)/(profile)/profile/orders/[uuid]/info/components/OrderInfoForm"

type OrderInfoPageProps = { uuid: string; title: string }

const OrderInfoPage = ({ title, uuid }: OrderInfoPageProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-9">
      <PageTitle title={title} backButtonUrl="/profile/orders" />
      <OrderInfoForm uuid={uuid} />
    </div>
  )
}

export default OrderInfoPage
