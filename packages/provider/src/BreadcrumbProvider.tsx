"use client"

import { createContext, useEffect } from "react"
import { usePathname } from "next/navigation"
import { BreadcrumbProps } from "@vardast/type/breadcrumb"
import { atom, PrimitiveAtom, useSetAtom } from "jotai"

export type OptionsAtom = BreadcrumbProps | undefined

interface BreadcrumbContextType {
  optionsAtom: PrimitiveAtom<OptionsAtom>
}
const optionsAtom = atom<OptionsAtom>({})

export const BreadcrumbContext = createContext<BreadcrumbContextType>({
  optionsAtom
})

export const setBreadCrumb = (options: BreadcrumbProps) => {
  const setOptions = useSetAtom(optionsAtom)

  useEffect(() => {
    setOptions(options)
  }, [])

  return null
}

const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
  const setOptions = useSetAtom(optionsAtom)

  const pathname = usePathname()

  useEffect(() => {
    return () => setOptions({ dynamic: true })
  }, [pathname])

  return (
    <BreadcrumbContext.Provider
      value={{
        optionsAtom
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}

export default BreadcrumbProvider
