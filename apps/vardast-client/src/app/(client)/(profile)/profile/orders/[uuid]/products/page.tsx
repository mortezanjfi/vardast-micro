import { Metadata } from "next"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderProductsPageIndex from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsPageIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "افزودن کالا به سفارش"
  }
}
const ProjectEdit = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const isMobileView = await CheckIsMobileView()

  return <OrderProductsPageIndex isMobileView={isMobileView} uuid={uuid} />
}
export default withMobileHeader(ProjectEdit, { title: "افزودن کالا به سفارش" })
