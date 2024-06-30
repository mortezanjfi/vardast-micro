import { Metadata } from "next"
import OfferPage from "@vardast/component/offers/OfferPage"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ثبت قیمت"
  }
}
export default async ({
  params: { offerId, uuid }
}: {
  params: { offerId: string; uuid: string }
}) => {
  const isMobileView = await CheckIsMobileView()

  return <OfferPage isMobileView={isMobileView} offerId={offerId} uuid={uuid} />
}
