import { Metadata } from "next"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderInfoPage from "@/app/(client)/(profile)/profile/orders/[uuid]/info/components/OrderInfoPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ثبت اطلاعات سفارش"
  }
}
const ProjectEdit = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const isMobileView = await CheckIsMobileView()

  return <OrderInfoPage isMobileView={isMobileView} uuid={uuid} />
}

export default withMobileHeader(ProjectEdit, { title: "ثبت اطلاعات سفارش" })
