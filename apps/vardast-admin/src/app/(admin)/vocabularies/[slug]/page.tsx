import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Categories from "../components/Categories"

const CategoriesPage = async ({ params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.base.taxonomy.category.index")) {
    redirect("/")
  }

  const slug = params.slug

  return <Categories session={session} slug={slug} />
}

export default CategoriesPage
