import { Metadata } from "next"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import FavoritesPageIndex from "@/app/(client)/favorites/components/FavoritesPageIndex"

// set dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "علاقه‌مندی ها"
  }
}

const Page = async () => {
  const isMobileView = await CheckIsMobileView()

  return <FavoritesPageIndex isMobileView={isMobileView} />
}

export default withMobileHeader(Page, { title: "علاقه‌مندی ها" })
