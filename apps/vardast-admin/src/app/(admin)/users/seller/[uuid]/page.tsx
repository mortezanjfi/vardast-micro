import { Metadata } from "next"

import SellerPage from "@/app/(admin)/users/seller/[uuid]/components/SellerPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ویرایش فروشندگان"
  }
}
const BrandEditPage = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  return uuid && <SellerPage uuid={uuid} />
}

export default BrandEditPage
