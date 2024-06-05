import { Metadata } from "next"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MyOrderPageIndex from "@/app/(seller)/my-orders/MyOrderPageIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات من"
  }
}

const MyOrderPage = async () => {
  const isMobileView = await CheckIsMobileView()

  return <MyOrderPageIndex isMobileView={isMobileView} />
}

export default withMobileHeader(MyOrderPage, { title: "سفارشات من" })
