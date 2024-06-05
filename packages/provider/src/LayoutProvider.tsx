"use client"

import { createContext, ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { BreadcrumbProps } from "@vardast/type/breadcrumb"
import { atom, PrimitiveAtom, useSetAtom } from "jotai"

interface LayoutContextType {
  breadcrumbAtom: PrimitiveAtom<BreadcrumbProps>
  sidebarAtom: PrimitiveAtom<JSX.Element>
}
const breadcrumbAtom = atom<BreadcrumbProps>({ dynamic: true, items: [] })
const sidebarAtom = atom<JSX.Element>(<></>)

export const LayoutContext = createContext<LayoutContextType>({
  breadcrumbAtom,
  sidebarAtom
})

export const setBreadCrumb = (options: BreadcrumbProps) => {
  const setBreadcrumb = useSetAtom(breadcrumbAtom)

  useEffect(() => {
    setBreadcrumb(options)
  }, [])

  return null
}

export const setSidebar = (reactNode: JSX.Element) => {
  const setSidebar = useSetAtom(sidebarAtom)

  useEffect(() => {
    setSidebar(reactNode)
  }, [])

  return null
}

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const setBreadcrumb = useSetAtom(breadcrumbAtom)
  const setSidebar = useSetAtom(sidebarAtom)

  const pathname = usePathname()

  useEffect(() => {
    return () => {
      setBreadcrumb({ dynamic: true })
      setSidebar(<></>)
    }
  }, [pathname])

  return (
    <LayoutContext.Provider
      value={{
        breadcrumbAtom,
        sidebarAtom
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutProvider
