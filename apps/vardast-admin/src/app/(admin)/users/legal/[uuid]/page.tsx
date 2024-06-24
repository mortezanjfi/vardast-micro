import { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import LegalEdit from "@vardast/component/legal/LegalEdit"
import { getServerSession } from "next-auth"

export async function generateMetadata(): Promise<Metadata> {
  // parent: ResolvingMetadata
  return {
    title: "ویرایش کاربر حقوقی"
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
    <LegalEdit
      title={(await generateMetadata()).title?.toString() as string}
      uuid={uuid}
    />
  )
}

export default BrandEditPage
