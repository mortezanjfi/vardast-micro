import OrderInfoCard from "@vardast/component/desktop/OrderInfoCard"

import OrderProductsList from "@/app/(admin)/orders/components/OrderProductsList"
import OrderSubmit from "@/app/(admin)/orders/components/OrderSubmit"
import UploadedFIles from "@/app/(admin)/orders/components/UploadedFIles"

type Props = { uuid: string }

function OrderDetail({ uuid }: Props) {
  return (
    <div className="flex w-full flex-col gap-9">
      <OrderInfoCard isAdmin={true} />
      <OrderProductsList />
      <UploadedFIles />
      <OrderSubmit uuid={uuid} />
    </div>
  )
}

export default OrderDetail
