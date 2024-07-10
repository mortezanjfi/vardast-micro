"use client"

import { useState } from "react"
import useTranslation from "next-translate/useTranslation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/src/tabs"
import OrdersBaseOnItem from "./OrdersBaseOnItem"
import OrdersPage from "./OrdersPage"

type Props = {
  isMobileView?: boolean
  title: string
}

const Orders = ({ isMobileView, title }: Props) => {
  const [activeTab, setActiveTab] = useState("productViewBase")

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
        <OrdersPage title={title} isAdmin={true} isMobileView={isMobileView} />
      </TabsContent>
      <TabsContent value="productViewBase">
        <OrdersBaseOnItem />
      </TabsContent>
    </Tabs>
  )
}

export default Orders
