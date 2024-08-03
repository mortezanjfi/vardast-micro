import { Metadata } from "next"

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
  return <VerifyOffer uuid={uuid} offerId={offerId} />
}
