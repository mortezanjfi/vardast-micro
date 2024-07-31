"use client"

import { useModals } from "@vardast/ui/modal"

import { OrderModalEnum } from "@/types/type"
import Lines from "@/app/(bid)/lines/components/Lines"
import OrderInfoModal from "@/app/(bid)/orders/[uuid]/components/OrderInfoModal"

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
