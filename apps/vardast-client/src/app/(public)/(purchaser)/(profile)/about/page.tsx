import { Metadata } from "next"
import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import AboutPageIndex from "@/app/(public)/(purchaser)/(profile)/about/components/AboutPageIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "درباره ما"
  }
}

const AboutPage = async () => {
  const isMobileView = await CheckIsMobileView()

  return <AboutPageIndex isMobileView={isMobileView} />
}

export default withMobileHeader(AboutPage, {
  title: "درباره ما"
})
