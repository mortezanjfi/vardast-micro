import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

import Vocabularies from "./components/Vocabularies"

const VocabulariesPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.abilities?.includes("gql.base.taxonomy.vocabulary.index")) {
    redirect("/admin")
  }

  return <Vocabularies />
}

export default VocabulariesPage
