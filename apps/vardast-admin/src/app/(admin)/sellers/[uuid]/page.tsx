import { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import SellerEdit from "@/app/(admin)/sellers/components/SellerEdit"

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
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.seller.index")) {
    redirect("/")
  }

  return (
    uuid && (
      <SellerEdit
        title={(await generateMetadata()).title?.toString() as string}
        uuid={uuid}
      />
    )
  )
}

export default BrandEditPage
