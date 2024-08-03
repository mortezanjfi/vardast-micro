"use client"

import { useState } from "react"
import { useQueryStates } from "next-usequerystate"

interface CustomQueryStatesProps {
  initialValues: any
  useQueryParams?: boolean
}

const useQueryInternalStates = ({
  initialValues,
  useQueryParams = false
}: CustomQueryStatesProps): [any, (newState: Partial<any>) => void] => {
  if (useQueryParams) {
    return useQueryStates(initialValues)
  } else {
    const [state, setState] = useState<any>(initialValues)
    const setCustomState = (newState: Partial<any>) => {
      setState((prevState) => ({
        ...prevState,
        ...newState
      }))
    }
    return [state, setCustomState]
  }
}

export { useQueryInternalStates }
