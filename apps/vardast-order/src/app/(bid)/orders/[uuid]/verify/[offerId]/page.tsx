import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import VerifyOffer from "../components/VerifyOffer"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "افزودن کالا به سفارش"
  }
}
export default async ({
  params: { uuid, offerId }
}: {
  params: { uuid: string; offerId: string }
}) => {
  const isMobileView = await CheckIsMobileView()

  return (
    <VerifyOffer isMobileView={isMobileView} uuid={uuid} offerId={offerId} />
  )
}
