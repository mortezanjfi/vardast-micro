"use client"

import { useContext, useEffect } from "react"
import { CrumbItemProps } from "@vardast/type/breadcrumb"
import { useAtom, useSetAtom } from "jotai"

import { LayoutContext } from "."

export const setBreadCrumb = (options: CrumbItemProps[]) => {
  const { breadcrumbAtom } = useContext(LayoutContext)
  const setBreadcrumb = useSetAtom(breadcrumbAtom)

  useEffect(() => {
    setBreadcrumb(options)
  }, [setBreadcrumb, options])
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

export const usePageLoading = () => {
  const { loadingVisibilityAtom } = useContext(LayoutContext)
  return useAtom(loadingVisibilityAtom)
}
