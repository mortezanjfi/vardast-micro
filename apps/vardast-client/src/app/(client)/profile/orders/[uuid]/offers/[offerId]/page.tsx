import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import OrderDetailPage from "@/app/(client)/profile/orders/[uuid]/components/OrderDetailPage"

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

  // const session = await getServerSession(authOptions)

  // if (!session?.abilities?.includes("gql.products.brand.index")) {
  //   redirect("/admin")
  // }

  return (
    <OrderDetailPage
      isMobileView={isMobileView}
      uuid={uuid}
      offerId={offerId}
    />
  )
}
