import { Metadata } from "next"
import OrderProductsPageIndex from "@vardast/component/order/products/OrderProductsPageIndex"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "افزودن کالا به سفارش"
  }
}
export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <OrderProductsPageIndex
      isAdmin={true}
      isMobileView={isMobileView}
      uuid={uuid}
    />
  )
}
