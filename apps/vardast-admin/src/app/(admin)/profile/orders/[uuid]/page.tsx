import { Metadata } from "next"
import OrderDetailPage from "@vardast/component/order/OrderDetailPage"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تایید سفارش"
  }
}
export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <OrderDetailPage isAdmin={true} isMobileView={isMobileView} uuid={uuid} />
  )
}
