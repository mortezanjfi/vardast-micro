import { Metadata } from "next"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import HomeIndex from "@/app/(client)/(home)/components/HomeIndex"

export const metadata: Metadata = {
  title: "بازار آنلاین مصالح ساختمانی",
  description: process.env.NEXT_PUBLIC_SLOGAN
}

export default async () => {
  const isMobileView = await CheckIsMobileView()

  return (
    <>
      <link rel="canonical" href={process.env.NEXT_PUBLIC_VARDAST} />
      <HomeIndex isMobileView={isMobileView} />
    </>
  )
}
