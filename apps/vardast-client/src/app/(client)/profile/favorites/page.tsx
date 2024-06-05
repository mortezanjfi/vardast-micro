import { Metadata } from "next"
import { redirect } from "next/navigation"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "علاقه‌مندی ها"
  }
}

const Page = async () => {
  const isMobileView = await CheckIsMobileView()

  redirect("/")

  // return <FavoritesPageIndex isMobileView={isMobileView} />
}

export default Page
