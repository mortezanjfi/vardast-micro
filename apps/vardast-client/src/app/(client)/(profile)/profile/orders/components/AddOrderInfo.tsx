"use client"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import AddOrderInfoForm from "@/app/(client)/(profile)/profile/orders/components/AddOrderInfoForm"

type AddOrderInfoProps = { uuid: string; title: string }

const AddOrderInfo = ({ title, uuid }: AddOrderInfoProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-9">
      <PageTitle title={title} />
      <AddOrderInfoForm uuid={uuid} />
    </div>
  )
}

export default AddOrderInfo
