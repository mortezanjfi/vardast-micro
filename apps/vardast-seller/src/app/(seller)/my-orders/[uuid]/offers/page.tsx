import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MyOrdersOffers from "@/app/(seller)/components/MyOrdersOffers"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پیشنهادات"
  }
}

export default async ({ params: { uuid } }: { params: { uuid: string } }) => {
  const isMobileView = await CheckIsMobileView()

  return <MyOrdersOffers isMobileView={isMobileView} uuid={uuid} />
}
