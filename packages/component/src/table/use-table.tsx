"use client"

import { useMemo } from "react"

import { UseTableType } from "./type"

const useTable: UseTableType = ({ model, dependencies }) => {
  const tableProps = useMemo(() => model, dependencies)

  return tableProps
}

export { useTable }
