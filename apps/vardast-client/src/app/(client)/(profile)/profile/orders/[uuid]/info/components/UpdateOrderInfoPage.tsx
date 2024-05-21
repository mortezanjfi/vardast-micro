"use client"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import UpdateOrderInfoForm from "@/app/(client)/(profile)/profile/orders/[uuid]/info/components/UpdateOrderInfoForm"

type UpdateOrderInfoProps = { uuid: string; title: string }

const UpdateOrderInfoPage = ({ title, uuid }: UpdateOrderInfoProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-9">
      <PageTitle title={title} backButtonUrl="/profile/orders" />
      <UpdateOrderInfoForm uuid={uuid} />
    </div>
  )
}

export default UpdateOrderInfoPage
