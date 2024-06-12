import { Metadata } from "next"
import OrderInfoPage from "@vardast/component/order/info/OrderInfoPage"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ثبت اطلاعات سفارش"
  }
}
export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()
  return <OrderInfoPage isMobileView={isMobileView} uuid={uuid} />
}
