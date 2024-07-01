import { Metadata } from "next"
import OrderPage from "@vardast/component/order/OrderPage"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تایید سفارش"
  }
}
export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()

  return <OrderPage isMobileView={isMobileView} uuid={uuid} />
}
