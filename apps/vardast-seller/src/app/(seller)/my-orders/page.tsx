import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MyOrderPageIndex from "@/app/(seller)/my-orders/MyOrderPageIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "سفارشات من"
  }
}

export default async () => {
  const isMobileView = await CheckIsMobileView()

  return <MyOrderPageIndex isMobileView={isMobileView} />
}
