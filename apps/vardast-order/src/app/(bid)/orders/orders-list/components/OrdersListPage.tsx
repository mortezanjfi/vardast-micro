"use client"

import { OnChangeModalsType, useModals } from "@vardast/component/modal"

import { OrderModalEnum } from "@/types/type"
import OrderInfoModal from "@/app/(bid)/orders/[uuid]/components/OrderInfoModal"
import Orders from "@/app/(bid)/orders/components/Orders"

type Props = {
  isMobileView?: boolean
}

export interface IOrdersTabProps extends Props {
  onChangeModals: OnChangeModalsType<OrderModalEnum>
}

const OrdersListPage = ({ isMobileView }: Props) => {
  const [modals, onChangeModals, onCloseModals] = useModals<OrderModalEnum>()

  return (
    <>
      <OrderInfoModal
        modals={modals}
        open={modals?.type === OrderModalEnum.ADD_ORDER}
        onCloseModals={onCloseModals}
      />
      <Orders onChangeModals={onChangeModals} isMobileView={isMobileView} />
    </>
  )
}

export default OrdersListPage
