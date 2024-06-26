import { Metadata } from "next"
import OrderDetailPage from "@vardast/component/order/OrderDetailPage"
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
