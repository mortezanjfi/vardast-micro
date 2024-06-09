import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderDetailPage from "@/app/(client)/profile/orders/[uuid]/components/OrderDetailPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تایید سفارش"
  }
}
export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()

  return <OrderDetailPage isMobileView={isMobileView} uuid={uuid} />
}
