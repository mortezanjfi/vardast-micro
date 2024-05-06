"use client"

import { createContext, useState } from "react"

interface LocationsContextType {
  activesOnly: boolean
  setActivesOnly: (_: boolean) => void
  toggleActivesOnly: () => void
}

export const LocationsContext = createContext<LocationsContextType>({
  activesOnly: false,
  setActivesOnly: (_: boolean) => {},
  toggleActivesOnly: () => {}
})

type Props = {
  children: React.ReactNode
}

export default function LocationsProvider({ children }: Props) {
  const [activesOnly, setActivesOnly] = useState<boolean>(false)

  const toggleActivesOnly = () => {
    const oldActivesOnlyMode = activesOnly
    setActivesOnly(!oldActivesOnlyMode)
  }

  return (
    <LocationsContext.Provider
      value={{
        activesOnly,
        setActivesOnly,
        toggleActivesOnly
      }}
    >
      {children}
    </LocationsContext.Provider>
  )
}
