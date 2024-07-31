"use client"

import { useModals } from "@vardast/ui/modal"

import Lines from "@/app/(bid)/lines/components/Lines"
import OrderInfoModal from "@/app/(bid)/orders/[uuid]/components/OrderInfoModal"
import { OrderModalEnum } from "@/app/(bid)/types/type"

const LinesPage = () => {
  const [modals, onChangeModals, onCloseModals] = useModals<OrderModalEnum>()

  return (
    <>
      <OrderInfoModal
        modals={modals}
        open={modals?.type === OrderModalEnum.ADD_ORDER}
        onCloseModals={onCloseModals}
      />
      <Lines onChangeModals={onChangeModals} />
    </>
  )
}

export default LinesPage
