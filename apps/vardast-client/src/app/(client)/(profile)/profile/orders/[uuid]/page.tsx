import { Metadata } from "next"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderDetailPage from "@/app/(client)/(profile)/profile/orders/[uuid]/components/OrderDetailPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تایید سفارش"
  }
}
const ProjectEdit = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const isMobileView = await CheckIsMobileView()

  return <OrderDetailPage isMobileView={isMobileView} uuid={uuid} />
}
export default withMobileHeader(ProjectEdit, { title: "تایید سفارش" })
