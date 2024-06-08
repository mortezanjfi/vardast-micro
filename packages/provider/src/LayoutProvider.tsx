"use client"

import { createContext, ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { BreadcrumbProps } from "@vardast/type/breadcrumb"
import { atom, PrimitiveAtom, useSetAtom } from "jotai"

interface LayoutContextType {
  breadcrumbAtom: PrimitiveAtom<BreadcrumbProps>
  sidebarAtom: PrimitiveAtom<JSX.Element>
  sidebarHamburgerAtom: PrimitiveAtom<boolean>

  pageHeaderAtom: PrimitiveAtom<JSX.Element>
}
const breadcrumbAtom = atom<BreadcrumbProps>({ dynamic: true, items: [] })
const sidebarAtom = atom<JSX.Element>(<></>)
const sidebarHamburgerAtom = atom<boolean>(false)
const pageHeaderAtom = atom<JSX.Element>(<></>)

export const LayoutContext = createContext<LayoutContextType>({
  breadcrumbAtom,
  sidebarAtom,
  sidebarHamburgerAtom,
  pageHeaderAtom
})

export const setBreadCrumb = (options: BreadcrumbProps) => {
  const setBreadcrumb = useSetAtom(breadcrumbAtom)

  useEffect(() => {
    setBreadcrumb(options)
  }, [setBreadcrumb, options])

  return null
}

export const setSidebar = (reactNode: JSX.Element) => {
  const setSidebar = useSetAtom(sidebarAtom)

  useEffect(() => {
    setSidebar(reactNode)
  }, [setSidebar, reactNode])

  return null
}

export const useSetSidebarHamburger = () => {
  const setSidebarHamburger = useSetAtom(sidebarHamburgerAtom)
  return setSidebarHamburger
}

export const setPageHeader = (reactNode: JSX.Element) => {
  const setPageHeader = useSetAtom(pageHeaderAtom)

  useEffect(() => {
    setPageHeader(reactNode)
  }, [setPageHeader, reactNode])

  return null
}

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const setBreadcrumb = useSetAtom(breadcrumbAtom)
  const setSidebar = useSetAtom(sidebarAtom)
  const setPageHeader = useSetAtom(pageHeaderAtom)

  const pathname = usePathname()

  useEffect(() => {
    return () => {
      setBreadcrumb({ dynamic: true })
      setSidebar(null)
      setPageHeader(null)
    }
  }, [pathname, setBreadcrumb, setSidebar, setPageHeader])

  return (
    <LayoutContext.Provider
      value={{
        breadcrumbAtom,
        sidebarAtom,
        sidebarHamburgerAtom,
        pageHeaderAtom
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutProvider
