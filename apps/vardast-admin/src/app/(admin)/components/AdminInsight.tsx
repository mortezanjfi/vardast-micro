"use client"

import OrdersReportsCharts from "@/app/(admin)/components/OrdersReportsCharts"

import InsightCardsSection from "./InsightCardsSection"

const AdminInsight = () => {
  return (
    <div className="row-span-1 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <InsightCardsSection />
      <OrdersReportsCharts />
    </div>
  )
}

export default AdminInsight
