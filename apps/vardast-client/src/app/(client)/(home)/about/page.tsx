import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import AboutPageIndex from "@/app/(client)/(home)/about/components/AboutPageIndex"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "درباره ما"
  }
}

const AboutPage = async () => {
  const isMobileView = await CheckIsMobileView()

  return <AboutPageIndex isMobileView={isMobileView} />
}

export default AboutPage
