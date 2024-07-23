import { CheckedTypeByArgs } from "./../../component/src/table/type"

export type ApiArgsType<TFilter = {}> = {
  page: number
  perPage: number
} & TFilter

export type TableResponseType<T> = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  from: number
  to: number
  data: T[]
}

export type ApiResponseType<T> = {
  [K in string]: TableResponseType<T>
}

export type TableFetchApiFunctionType = <T, K, TState extends Object>(
  args: CheckedTypeByArgs<TState, ApiArgsType<K>>
) => Promise<ApiResponseType<T>>
