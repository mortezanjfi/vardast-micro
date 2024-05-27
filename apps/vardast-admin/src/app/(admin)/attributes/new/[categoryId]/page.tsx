import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import AttributeForm from "@/app/(admin)/attributes/components/AttributeForm"

const CreateAttributePage = async ({
  params: { categoryId }
}: {
  params: { categoryId: string }
}) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.attribute.index")) {
    redirect("/")
  }

  return <AttributeForm categoryId={categoryId} />
}

export default CreateAttributePage
