import {
  ColumnDef, // Importing Column from react-table
  Row,
  TableState
} from "@tanstack/react-table"
import { ApiArgsType, ApiResponseType } from "@vardast/query/type"
import { UseFormReturn } from "react-hook-form"
import { TypeOf, ZodType } from "zod"

export type OnRowFunctionType = (row: Row<T>) => void

export interface ITableProps<
  T,
  TSchema extends ZodType<any, any> | undefined = undefined
> {
  columns: Array<ColumnDef<T>>
  selectable?: boolean
  paginable?: boolean
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
  filters?: {
    schema: TSchema
    Component: React.FC<IFilterProps<TypeOf<TSchema>>>
  }
}

export interface IFilterProps<T> {
  form: UseFormReturn<T, any, undefined>
}
