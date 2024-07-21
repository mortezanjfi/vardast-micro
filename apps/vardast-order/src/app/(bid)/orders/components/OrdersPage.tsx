"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@vardast/ui/tabs"
import useTranslation from "next-translate/useTranslation"

import OrderLines from "@/app/(bid)/orders/components/OrderLines"

import Orders from "./Orders"

type Props = {
  isMobileView?: boolean
}

const OrdersPage = ({ isMobileView }: Props) => {
  const [activeTab, setActiveTab] = useState("orderViewBase")

  const { t } = useTranslation()
  return (
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
        <Orders isMobileView={isMobileView} />
      </TabsContent>
      <TabsContent value="productViewBase">
        <OrderLines isMobileView={isMobileView} />
      </TabsContent>
    </Tabs>
  )
}

export default OrdersPage
