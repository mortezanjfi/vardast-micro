import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderProductsPageIndex from "@/app/(client)/profile/orders/[uuid]/products/components/OrderProductsPageIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "افزودن کالا به سفارش"
  }
}
export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()

  return <OrderProductsPageIndex isMobileView={isMobileView} uuid={uuid} />
}
