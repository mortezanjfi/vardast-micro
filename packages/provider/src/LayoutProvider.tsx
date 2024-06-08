"use client"

import { createContext, ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { BreadcrumbProps } from "@vardast/type/breadcrumb"
import { atom, useSetAtom, WritableAtom } from "jotai"

type WritableAtomType<Value> = WritableAtom<Value, [Value], void>

interface LayoutContextType {
  breadcrumbAtom: WritableAtomType<BreadcrumbProps>
  sidebarAtom: WritableAtomType<JSX.Element | null>
  sidebarHamburgerAtom: WritableAtomType<boolean>
  pageHeaderAtom: WritableAtomType<JSX.Element | null>
}

const breadcrumbAtom: WritableAtomType<BreadcrumbProps> = atom(
  { dynamic: true, items: [] },
  (get, set, update) => set(breadcrumbAtom, update)
)
const sidebarAtom: WritableAtomType<JSX.Element | null> = atom(
  null,
  (get, set, update) => set(sidebarAtom, update)
)
const sidebarHamburgerAtom: WritableAtomType<boolean> = atom(
  false,
  (get, set, update) => set(sidebarHamburgerAtom, update)
)
const pageHeaderAtom: WritableAtomType<JSX.Element | null> = atom(
  null,
  (get, set, update) => set(pageHeaderAtom, update)
)

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
      setBreadcrumb({ dynamic: true, items: [] })
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
