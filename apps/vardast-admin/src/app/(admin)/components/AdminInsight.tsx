"use client"

import OrdersReportsCharts from "@/app/(admin)/components/OrdersReportsCharts"

import InsightCardsSection from "./InsightCardsSection"

const AdminInsight = () => {
  return (
    <div className="grid grid-rows-5 gap-7">
      <InsightCardsSection />
      <OrdersReportsCharts />
    </div>
  )
}

export default AdminInsight
