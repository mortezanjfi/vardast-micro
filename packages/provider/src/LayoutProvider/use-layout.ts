"use client"

import { useContext, useEffect } from "react"
import { usePathname } from "next/navigation"
import { CrumbItemProps } from "@vardast/type/breadcrumb"
import { stringHasOnlyNumberValidator } from "@vardast/util/stringHasOnlyNumberValidator"
import { useSetAtom } from "jotai"

import { LayoutContext } from "."

export const setBreadCrumb = (items: CrumbItemProps[]) => {
  // const { t } = useTranslation()
  const { breadcrumbAtom } = useContext(LayoutContext)
  const setBreadcrumb = useSetAtom(breadcrumbAtom)
  const pathname = usePathname()

  useEffect(() => {
    let result: CrumbItemProps[]

    if (items.length) {
      result = items
    } else {
      const pathWithoutQuery = pathname?.split("?")[0]
      let pathArray = pathWithoutQuery?.split("/")
      pathArray?.shift()

      pathArray = pathArray?.filter((path) => path !== "")

      result = pathArray?.map((path, index) => {
        const href = "/" + pathArray?.slice(0, index + 1)?.join("/")
        return {
          path: href,
          label: stringHasOnlyNumberValidator(path)
            ? `common:details`
            : +path > 0
              ? path
              : `common:${path}`,
          isCurrent: index === pathArray?.length - 1
        }
      })
    }

    setBreadcrumb(result)
  }, [pathname, setBreadcrumb, items])
}

export const setSidebar = (reactNode: JSX.Element) => {
  const { sidebarAtom } = useContext(LayoutContext)
  const setSidebar = useSetAtom(sidebarAtom)

  useEffect(() => {
    setSidebar(reactNode)
  }, [setSidebar, reactNode])
}

export const useSetSidebarHamburger = () => {
  const { sidebarHamburgerAtom } = useContext(LayoutContext)

  const setSidebarHamburger = useSetAtom(sidebarHamburgerAtom)
  return setSidebarHamburger
}

export const setPageHeader = (reactNode: JSX.Element) => {
  const { pageHeaderAtom } = useContext(LayoutContext)

  const setPageHeader = useSetAtom(pageHeaderAtom)

  useEffect(() => {
    setPageHeader(reactNode)
  }, [setPageHeader, reactNode])
}
