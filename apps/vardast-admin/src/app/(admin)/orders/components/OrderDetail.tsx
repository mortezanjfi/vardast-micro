import OrderInfoCard from "@vardast/component/desktop/OrderInfoCard"

import OrderProductsList from "@/app/(admin)/orders/components/OrderProductsList"
import OrderSubmit from "@/app/(admin)/orders/components/OrderSubmit"
import UploadedFIles from "@/app/(admin)/orders/components/UploadedFIles"

type Props = {}

function OrderDetail({}: Props) {
  return (
    <div className="flex w-full flex-col gap-9">
      <OrderInfoCard isAdmin={true} />
      <OrderProductsList />
      <UploadedFIles />
      <OrderSubmit />
    </div>
  )
}

export default OrderDetail
