import { redirect } from "next/navigation"

export type SignInSearchIndexProps = {
  params: { slug: Array<string> }
}

const RedirectPage = async ({ params }: SignInSearchIndexProps) => {
  const returnedUrl = params?.slug?.join("/") ? params?.slug?.join("/") : ""

  return redirect(`${returnedUrl}`)
}

export default RedirectPage
