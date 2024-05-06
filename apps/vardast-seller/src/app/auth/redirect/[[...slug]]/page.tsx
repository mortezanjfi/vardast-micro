import { redirect } from "next/navigation"
import { authOptions } from "@vardast/auth/authOptions"
import { getServerSession } from "next-auth"

export type SignInSearchIndexProps = {
  params: { slug: Array<string> }
}

const RedirectPage = async ({ params }: SignInSearchIndexProps) => {
  const session = await getServerSession(authOptions)
  const returnedUrl = params?.slug?.join("/") ? params?.slug?.join("/") : ""

  //   if (!session) {
  //     return notFound()
  //   }

  // if (session?.profile?.roles.some((role) => role?.name === "admin")) {
  //   if (process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller") {
  //     return redirect(`/admin`)
  //   }
  //   return redirect(`/admin`)
  // }

  if (session?.profile?.roles.some((role) => role?.name === "seller")) {
    if (process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller") {
      return redirect(`/${returnedUrl}`)
    }
    return redirect(`/${returnedUrl}`)
  }

  if (process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller") {
    return redirect(`/auth/request-seller`) // Redirect to "/seller" for seller users
  }

  return redirect(`/${returnedUrl}`)
}

export default RedirectPage
