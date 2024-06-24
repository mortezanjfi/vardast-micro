import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import LegalEdit from "@vardast/component/legal/LegalEdit"
import { getServerSession } from "next-auth"

const BrandEditPage = async ({
  params: { uuid }
}: {
  params: { uuid: string }
}) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.seller.index")) {
    redirect("/")
  }

  return <LegalEdit uuid={uuid} />
}

export default BrandEditPage
