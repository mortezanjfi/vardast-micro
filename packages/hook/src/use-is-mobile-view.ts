"use client"

import { useEffect, useState } from "react"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const useIsMobileView = () => {
  const [isMobileView, setIsMobileView] = useState(null)

  useEffect(() => {
    const checkIsMobileView = async () => {
      const isMobile = await CheckIsMobileView()
      setIsMobileView(isMobile)
    }

    checkIsMobileView()
  }, [])

  return isMobileView
}

export default useIsMobileView
