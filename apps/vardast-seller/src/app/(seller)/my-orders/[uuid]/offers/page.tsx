import { Metadata } from "next"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import MyOrdersOffers from "@/app/(seller)/components/MyOrdersOffers"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "پیشنهادات"
  }
}

const OrderOffersPage = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const isMobileView = await CheckIsMobileView()

  return <MyOrdersOffers isMobileView={isMobileView} uuid={uuid} />
}

export default withMobileHeader(OrderOffersPage, { title: "پیشنهادات" })
