import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderInfoPage from "@/app/(bid)/orders/[uuid]/info/components/OrderInfoPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ثبت اطلاعات سفارش"
  }
}
export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()
  return <OrderInfoPage isMobileView={isMobileView} uuid={uuid} />
}
