import { DependencyList } from "react"
import {
  ColumnDef, // Importing Column from react-table
  Row,
  TableState
} from "@tanstack/react-table"
import { ApiArgsType } from "@vardast/query/type"
import { SelectPopoverPropsType } from "@vardast/ui/src/select-popover"
import { UseFormReturn } from "react-hook-form"
import { TypeOf, ZodType } from "zod"

import { CardProps } from "../Card"

export enum FilterComponentTypeEnum {
  INPUT = "INPUT",
  SELECT = "SELECT"
}

type IFilterMap<T extends FilterComponentTypeEnum> =
  T extends FilterComponentTypeEnum.SELECT
    ? {
        type: FilterComponentTypeEnum.SELECT
      } & Omit<SelectPopoverPropsType, "value" | "onSelect">
    : { type: FilterComponentTypeEnum.INPUT }

type IFilter<T extends FilterComponentTypeEnum, TName> = IFilterMap<T> & {
  name: TName
  title: string
}

export type CheckedTypeByArgs<T, K> = T extends undefined ? K : T

export type OnRowFunctionType<T> = (row: Row<T>) => void
export type TableDirectDataType<T> = {
  directLoading?: boolean
  data: Array<Partial<T>>
}

type FetchWithData<T> = {
  directData: TableDirectDataType<T>
  accessToken?: never
  api?: never
}

type FetchWithApi<_T, TArgs, TSchema> = {
  directData?: never
  api: (args: CheckedTypeByArgs<TArgs, ApiArgsType<TSchema>>) => Promise<any>
}

type FetchConfig<T, TArgs, TSchema> =
  | FetchWithData<T>
  | FetchWithApi<T, TArgs, TSchema>

type InternalArgsType<T, TArgs> = T extends { directData: any } ? never : TArgs

export type UseTableType = <
  T,
  TSchema extends ZodType<any, any, any> = undefined,
  TState extends Object = any,
  TResponse = undefined
>(args: {
  model: ITableProps<T, TSchema, TState, TResponse>
  dependencies?: DependencyList
}) => ITableProps<T, TSchema, TState, TResponse>

export type Column<T> = Array<ColumnDef<T>>
export interface ITableProps<
  T,
  TSchema extends ZodType<any, any, any> = undefined,
  TArgs extends Object = any,
  TResponse = undefined
> {
  name: string
  columns: Column<T>
  selectable?: boolean
  indexable?: boolean
  internalArgs?: InternalArgsType<FetchConfig<T, TArgs, TSchema>, TArgs>
  paginable?: boolean
  container?: Omit<CardProps, "children">
  onRow?: {
    onClick?: (row: Row<T>) => void
    url?: (row: Row<T>) => string | string
  }
  fetch: FetchConfig<T, TArgs, TSchema>
  handleResponse?: (args: TResponse) => Array<Partial<T>>
  getTableState?: (args: Partial<TableState> & { data: T[] }) => void
  filters?: FilterOptions<TSchema>
}

export type FilterOptions<TSchema extends ZodType<any, any, any>> = {
  options: Filter<TSchema>[]
  schema: TSchema
}

type Filter<TSchema extends ZodType<any, any, any>> = IFilter<
  FilterComponentTypeEnum.INPUT | FilterComponentTypeEnum.SELECT,
  keyof TypeOf<TSchema>
>

export interface IFilterProps<TSchema extends ZodType<any, any, any>> {
  form: UseFormReturn<TSchema, any, undefined>
  filters: FilterOptions<TSchema>
}

export type RenderItemType<TSchema extends ZodType<any, any, any>> = (
  filter: Filter<TSchema>,
  value: string
) => JSX.Element
