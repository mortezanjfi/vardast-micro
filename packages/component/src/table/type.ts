import {
  ColumnDef, // Importing Column from react-table
  Row,
  TableState
} from "@tanstack/react-table"
import { ApiArgsType, ApiResponseType } from "@vardast/query/type"
import { SelectPopoverPropsType } from "@vardast/ui/src/select-popover"
import { UseFormReturn } from "react-hook-form"
import { TypeOf, ZodType } from "zod"

import { CardContainerProps } from "../desktop/CardContainer"

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

export type OnRowFunctionType<T> = (row: Row<T>) => void

export interface ITableProps<T, TSchema extends ZodType<any, any, any>> {
  name: string
  columns: Array<ColumnDef<T>>
  selectable?: boolean
  paginable?: boolean
  container?: Omit<CardContainerProps, "children">
  onRow?: {
    onClick?: (row: Row<T>) => void
    url?: (row: Row<T>) => string | string
  }
  fetch: {
    accessToken?: boolean
    api: (
      args: ApiArgsType<TSchema>,
      accessToken?: string
    ) => Promise<ApiResponseType<T>>
  }
  handleResponse?: (args: ApiResponseType<T>) => void
  getTableState?: (args: Partial<TableState> & { data: T[] }) => void
  filters?: FilterOptions<TSchema>
}

export type FilterOptions<TSchema extends ZodType<any, any, any>> = {
  options: Filter<TSchema>[]
  schema: TSchema
}

export type Filter<TSchema extends ZodType<any, any, any>> = IFilter<
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
