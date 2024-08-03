"use client"

import { useModals } from "@vardast/ui/modal"

import OrderInfoModal from "@/app/(layout)/(bid)/orders/[uuid]/components/OrderInfoModal"
import Orders from "@/app/(layout)/(bid)/orders/components/Orders"
import { OrderModalEnum } from "@/app/(layout)/(bid)/types/type"

const OrdersPage = () => {
  const [modals, onChangeModals, onCloseModals] = useModals<OrderModalEnum>()

  return (
    <>
      <OrderInfoModal
        modals={modals}
        open={modals?.type === OrderModalEnum.ADD_ORDER}
        onCloseModals={onCloseModals}
      />
      <Orders onChangeModals={onChangeModals} />
    </>
  )
}

export default OrdersPage
