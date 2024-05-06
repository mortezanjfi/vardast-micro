"use client"

import { usePathname } from "next/navigation"
import { WithNavigationRouteItem } from "@vardast/lib/constants"

/**
 * check equality of current path with list of 'pathnames' that you pass. for example: useIsCurrentPath(["profile", "auth"])
 */
const useIsCurrentPath = (pathnames: WithNavigationRouteItem[]) => {
  const pathname = usePathname()

  if (pathname.length === 0) {
    return false
  }

  if (pathnames.length > 0) {
    return pathnames.some(({ path, forceEqual, dynamicRouteAllow = false }) => {
      let checkPathTemp = ""
      if (path.split("/").length > 1) {
        checkPathTemp = pathname.substring(1)
      } else {
        checkPathTemp = pathname.split("/")[1] as string
      }

      return forceEqual
        ? checkPathTemp.includes(path)
        : dynamicRouteAllow
          ? path === checkPathTemp && pathname.split("/").length > 2
          : path === checkPathTemp
    })
  }

  return pathname.split("/")[1] === pathname[0]
}

export default useIsCurrentPath
