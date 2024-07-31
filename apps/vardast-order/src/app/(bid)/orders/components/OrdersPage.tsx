"use client"

import { useModals } from "@vardast/ui/modal"

import { OrderModalEnum } from "@/types/type"
import OrderInfoModal from "@/app/(bid)/orders/[uuid]/components/OrderInfoModal"
import Orders from "@/app/(bid)/orders/components/Orders"

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
