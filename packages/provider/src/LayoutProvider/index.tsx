"use client"

import { createContext, ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { CrumbItemProps } from "@vardast/type/breadcrumb"
import { atom, useSetAtom, WritableAtom } from "jotai"

type WritableAtomType<Value> = WritableAtom<Value, [Value], void>

interface LayoutContextType {
  breadcrumbAtom: WritableAtomType<CrumbItemProps[]>
  sidebarAtom: WritableAtomType<JSX.Element | null>
  sidebarHamburgerAtom: WritableAtomType<boolean>
  loadingVisibilityAtom: WritableAtomType<boolean>
  pageHeaderAtom: WritableAtomType<JSX.Element | null>
}

const breadcrumbAtom: WritableAtomType<CrumbItemProps[]> = atom(
  [],
  (_, set, update) => set(breadcrumbAtom, update)
)
const loadingVisibilityAtom: WritableAtomType<boolean> = atom(
  false,
  (_, set, update) => set(loadingVisibilityAtom, update)
)
const sidebarAtom: WritableAtomType<JSX.Element | null> = atom(
  null,
  (_, set, update) => set(sidebarAtom, update)
)
const sidebarHamburgerAtom: WritableAtomType<boolean> = atom(
  false,
  (_, set, update) => set(sidebarHamburgerAtom, update)
)
const pageHeaderAtom: WritableAtomType<JSX.Element | null> = atom(
  null,
  (_, set, update) => set(pageHeaderAtom, update)
)

export const LayoutContext = createContext<LayoutContextType>({
  breadcrumbAtom,
  sidebarAtom,
  sidebarHamburgerAtom,
  loadingVisibilityAtom,
  pageHeaderAtom
})

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const setBreadcrumb = useSetAtom(breadcrumbAtom)
  const setSidebar = useSetAtom(sidebarAtom)
  const setPageHeader = useSetAtom(pageHeaderAtom)
  const setLoading = useSetAtom(loadingVisibilityAtom)

  const pathname = usePathname()

  useEffect(() => {
    return () => {
      setBreadcrumb([])
      setSidebar(null)
      setPageHeader(null)
      setLoading(false)
    }
  }, [pathname])

  return (
    <LayoutContext.Provider
      value={{
        breadcrumbAtom,
        sidebarAtom,
        sidebarHamburgerAtom,
        pageHeaderAtom,
        loadingVisibilityAtom
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutProvider
