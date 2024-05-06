"use client"

import { createContext, useEffect, useState } from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import {
  EventTrackerTypes,
  GetBrandQuery,
  GetSellerQuery
} from "@vardast/graphql/generated"
import axiosApis from "@vardast/query/queryClients/axiosApis"
import { atom, PrimitiveAtom, useAtom } from "jotai"

export type VersionType = {
  version?: string
  shouldReload?: boolean
}

interface PublicContextType {
  categoriesFilterVisibilityAtom: PrimitiveAtom<boolean>
  globalSearchModalAtom: PrimitiveAtom<boolean>
  sortFilterVisibilityAtom: PrimitiveAtom<boolean>
  filtersVisibilityAtom: PrimitiveAtom<boolean>
  contactModalVisibilityAtom: PrimitiveAtom<boolean>
  contactModalDataAtom: PrimitiveAtom<{
    data: GetSellerQuery["seller"] | GetBrandQuery["brand"] | undefined
    type: EventTrackerTypes
    title?: string
  }>
  showNavbar: PrimitiveAtom<boolean>
  appVersion: PrimitiveAtom<VersionType>
}

const categoriesFilterVisibilityAtom = atom<boolean>(false)
const globalSearchModalAtom = atom<boolean>(false)
const sortFilterVisibilityAtom = atom<boolean>(false)
const filtersVisibilityAtom = atom<boolean>(false)
const contactModalVisibilityAtom = atom<boolean>(false)
const contactModalDataAtom = atom<{
  data: GetSellerQuery["seller"] | GetBrandQuery["brand"] | undefined
  type: EventTrackerTypes
  title?: string
}>({
  data: undefined,
  type: EventTrackerTypes.ViewOffer,
  title: "اطلاعات تماس"
})
const showNavbar = atom<boolean>(true)
const appVersion = atom<VersionType>({
  version: undefined,
  shouldReload: undefined
})

export const PublicContext = createContext<PublicContextType>({
  categoriesFilterVisibilityAtom,
  globalSearchModalAtom,
  sortFilterVisibilityAtom,
  filtersVisibilityAtom,
  contactModalVisibilityAtom,
  contactModalDataAtom,
  appVersion,
  showNavbar
})

type PublicProviderProps = {
  children: React.ReactNode
  isMobileView?: boolean
}

const PublicProvider = ({ isMobileView, children }: PublicProviderProps) => {
  const [appVersionInformation, setAppVersionInformation] = useAtom(appVersion)
  const [orientation, setOrientation] = useState("")

  useQuery(["check-version"], {
    queryFn: async () => {
      const response = await axiosApis.getVersion()
      const localStorageVersion = localStorage.getItem("version")
      if (localStorageVersion) {
        if (localStorageVersion == response.data) {
          setAppVersionInformation({
            version: response.data,
            shouldReload: false
          })
          return response
        }
        setAppVersionInformation({
          version: response.data,
          shouldReload: true
        })
        localStorage.setItem("version", response.data)
        location.reload()
        return response
      }
      setAppVersionInformation({
        version: response.data,
        shouldReload: false
      })
      localStorage.setItem("version", response.data)
    },
    enabled: !appVersionInformation
  })

  useEffect(() => {
    // Function to update the orientation state
    function updateOrientation() {
      if (typeof window !== "undefined" && window.screen?.orientation?.type) {
        setOrientation(window.screen?.orientation?.type)
      }
      // window.location.reload()
    }
    // Initial update of the orientation state
    updateOrientation()
    // Add an event listener for orientation change
    window.addEventListener("orientationchange", updateOrientation)
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("orientationchange", updateOrientation)
    }
  }, [orientation])

  return (
    <PublicContext.Provider
      value={{
        categoriesFilterVisibilityAtom,
        globalSearchModalAtom,
        sortFilterVisibilityAtom,
        filtersVisibilityAtom,
        contactModalVisibilityAtom,
        contactModalDataAtom,
        appVersion,
        showNavbar
      }}
    >
      {isMobileView &&
      (orientation === "landscape-primary" ||
        orientation === "landscape-secondary") ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap bg-primary text-white">
          <Image
            src="/images/rotation.png"
            alt="rotate"
            width={150}
            height={150}
          />
          <p>لطفاً گوشی خود را عمودی نگه دارید.</p>
        </div>
      ) : (
        children
      )}
    </PublicContext.Provider>
  )
}

export default PublicProvider
