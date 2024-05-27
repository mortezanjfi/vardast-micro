/* eslint-disable prettier/prettier */
import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import BrandForm from "@/app/(admin)/brands/components/OldBrandForm"

const CreateBrandPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.products.brand.index")) {
    redirect("/")
  }

  return <BrandForm />
}

export default CreateBrandPage
