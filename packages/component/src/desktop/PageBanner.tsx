"use client"

import { ReactNode, useContext } from "react"
import { LayoutContext } from "@vardast/provider/LayoutProvider"
import { useAtomValue } from "jotai"

interface PageBannerProps {}

const PageBanner = ({}: PageBannerProps) => {
  const { pageHeaderAtom } = useContext(LayoutContext)
  const innerComponent: ReactNode = useAtomValue(pageHeaderAtom)

  return innerComponent ? innerComponent : null
}

export default PageBanner
