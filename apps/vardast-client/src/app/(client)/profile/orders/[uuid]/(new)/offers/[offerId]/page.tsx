import { Metadata } from "next"
import OffersPage from "@vardast/component/offers/OffersPage"
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

  return <OffersPage uuid={uuid} isMobileView={isMobileView} />
}
