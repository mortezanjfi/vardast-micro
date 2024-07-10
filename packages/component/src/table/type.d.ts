import {
  ColumnDef, // Importing Column from react-table
  TableState
} from "@tanstack/react-table"
import { ApiArgsType, ApiResponseType } from "@vardast/query/type"
import { UseFormReturn } from "react-hook-form"
import { TypeOf, ZodType } from "zod"

export interface ITableProps<
  T,
  TSchema extends ZodType<any, any> | undefined = undefined
> {
  columns: Array<ColumnDef<T>>
  accessToken?: string
  selectable?: boolean
  fetchApiData: (
    args: ApiArgsType<TSchema>,
    accessToken?: string
  ) => Promise<ApiResponseType<T>>
  // handleResponse?: (args: ApiResponseType<T>) => void
  getTableState?: (args: Partial<TableState> & { data: T[] }) => void
  filters?: {
    schema: TSchema
    Component: React.FC<IFilterProps<TypeOf<TSchema>>>
  }
}

export interface IFilterProps<T> {
  form: UseFormReturn<T, any, undefined>
}
