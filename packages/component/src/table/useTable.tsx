"use client"

import { DependencyList, useMemo } from "react"
import { ZodType } from "zod"

import { ITableProps } from "./type"

type UseTableType = <
  T,
  TSchema extends ZodType<any, any, any> = undefined,
  TState extends Object = any,
  TResponse = undefined
>(args: {
  model: ITableProps<T, TSchema, TState, TResponse>
  dependencies?: DependencyList
}) => ITableProps<T, TSchema, TState, TResponse>

const useTable: UseTableType = ({ model, dependencies }) => {
  const tableProps = useMemo(() => model, dependencies)

  return tableProps
}

export default useTable
