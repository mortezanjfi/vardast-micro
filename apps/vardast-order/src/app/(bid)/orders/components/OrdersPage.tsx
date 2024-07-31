"use client"

import { useState } from "react"
import { OnChangeModalsType, useModals } from "@vardast/component/modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import useTranslation from "next-translate/useTranslation"

import { OrderModalEnum } from "@/types/type"
import OrderInfoModal from "@/app/(bid)/orders/[uuid]/components/OrderInfoModal"
import OrderLines from "@/app/(bid)/orders/components/OrderLines"

import Orders from "./Orders"

type Props = {
  isMobileView?: boolean
}

export interface IOrdersTabProps extends Props {
  onChangeModals: OnChangeModalsType<OrderModalEnum>
}

const OrdersPage = ({ isMobileView }: Props) => {
  const [activeTab, setActiveTab] = useState("orderViewBase")
  const [modals, onChangeModals, onCloseModals] = useModals<OrderModalEnum>()

  const { t } = useTranslation()
  return (
    <>
      <OrderInfoModal
        modals={modals}
        open={modals?.type === OrderModalEnum.ADD_ORDER}
        onCloseModals={onCloseModals}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full pb-8">
          <TabsTrigger value="orderViewBase">
            {t("common:order-view-base")}
          </TabsTrigger>
          <TabsTrigger value="productViewBase">
            {t("common:product-view-base")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orderViewBase">
          <Orders onChangeModals={onChangeModals} isMobileView={isMobileView} />
        </TabsContent>
        <TabsContent value="productViewBase">
          <OrderLines
            onChangeModals={onChangeModals}
            isMobileView={isMobileView}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default OrdersPage
