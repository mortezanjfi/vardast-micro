import { Metadata } from "next"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderDetailIndex from "@/app/(seller)/components/OrderDetailIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "جزییات سفارش"
  }
}

const Page = async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()

  return <OrderDetailIndex isMobileView={isMobileView} uuid={uuid} />
}

export default withMobileHeader(Page, { title: "جزییات سفارش" })
