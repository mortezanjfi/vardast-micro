"use client"

import { OnChangeModalsType, useModals } from "@vardast/component/modal"

import { OrderModalEnum } from "@/types/type"
import OrderInfoModal from "@/app/(bid)/orders/[uuid]/components/OrderInfoModal"
import OrderLines from "@/app/(bid)/orders/components/OrderLines"

type Props = {
  isMobileView?: boolean
}

export interface IOrdersTabProps extends Props {
  onChangeModals: OnChangeModalsType<OrderModalEnum>
}

const OrdersLinePage = ({ isMobileView }: Props) => {
  const [modals, onChangeModals, onCloseModals] = useModals<OrderModalEnum>()

  return (
    <>
      <OrderInfoModal
        modals={modals}
        open={modals?.type === OrderModalEnum.ADD_ORDER}
        onCloseModals={onCloseModals}
      />
      <OrderLines onChangeModals={onChangeModals} isMobileView={isMobileView} />{" "}
    </>
  )
}

export default OrdersLinePage
