"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useQuery } from "@tanstack/react-query"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable
} from "@tanstack/react-table"
import {
  ApiArgsType,
  ApiResponseType,
  TableResponseType
} from "@vardast/query/type"
import { Checkbox } from "@vardast/ui/checkbox"
import { Form } from "@vardast/ui/form"
import { clsx } from "clsx"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import {
  createParser,
  parseAsInteger,
  useQueryStates
} from "next-usequerystate"
import { DefaultValues, useForm } from "react-hook-form"
import { AnyZodObject, TypeOf, ZodDefault, ZodSchema } from "zod"

import CardContainer from "../desktop/CardContainer"
import Loading from "../Loading"
import NotFoundIcon from "../not-found-icon"
import Filter from "./Filter"
import TablePagination from "./TablePagination"
import { ITableProps } from "./type"

const filtersParser = createParser({
  parse: (value) => (value ? JSON.parse(value) : {}),
  serialize: (value) => JSON.stringify(value)
})

const serializedDefaultForm = (data, setValue) => {
  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      setValue(key, `${value}`)
    }
  })
}

const convertArgsToNumber = (data: any) => {
  const args = { ...data }
  Object.entries(args).forEach(([key, value]) => {
    if (value) {
      if (Number(value)) {
        args[key] = Number(value)
      }
    } else {
      delete args[key]
    }
  })
  return args
}

const clearData = <T,>(filter: T) => {
  const args = { ...filter }
  Object.entries(filter).forEach(([key, value]) => {
    if (!value) {
      delete args[key]
    }
  })
  return args
}

function getDefaults<Schema extends AnyZodObject>(schema: Schema) {
  if (!schema?.shape || !Object.keys(schema?.shape).length) {
    return {}
  }
  return Object.fromEntries(
    Object.entries(schema?.shape).map(([key, value]) => {
      if (value instanceof ZodDefault) return [key, value._def.defaultValue()]
      return [key, ""]
    })
  )
}

const Table = <
  T extends object,
  TSchema extends ZodSchema<any> = ZodSchema<any>
>({
  name,
  columns: columnsProp,
  onRow,
  paginable,
  selectable,
  indexable = true,
  fetch,
  handleResponse,
  getTableState,
  container,
  filters
}: ITableProps<T, TSchema>) => {
  const [fetchArgs, setFetchArgs] = useQueryStates({
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(10),
    args: filtersParser.withDefault({})
  })
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState({})
  const { data: session } = useSession()

  const memoizeFetchArgs: ApiArgsType<TSchema> = useMemo(() => {
    const args = convertArgsToNumber(fetchArgs.args)
    return {
      page: fetchArgs.pageIndex + 1,
      perPage: fetchArgs.pageSize,
      ...args
    }
  }, [fetchArgs.pageIndex, fetchArgs.pageSize, fetchArgs.args])

  const memoizePagination: PaginationState = useMemo(
    () => ({
      pageIndex: fetchArgs.pageIndex ?? 0,
      pageSize: fetchArgs.pageSize ?? 10
    }),
    [fetchArgs.pageIndex, fetchArgs.pageSize]
  )

  const memoizedDefaultValues = useMemo(
    () => getDefaults(filters?.schema as unknown as AnyZodObject),
    [filters?.schema]
  )

  const { data, isLoading, isFetching } = useQuery<
    ApiResponseType<T | unknown>
  >({
    queryKey: [name, "table", memoizeFetchArgs],
    queryFn: async () => {
      const response = await fetch.api(
        memoizeFetchArgs,
        fetch?.accessToken && session?.accessToken
      )
      setRowSelection({})
      if (handleResponse) {
        handleResponse(response)
      }
      return response
    },
    keepPreviousData: true,
    enabled: fetch?.accessToken ? !!session?.accessToken : true
  })

  const serializedData = useMemo(
    () =>
      data
        ? (data[Object.keys(data)[0]] as unknown as TableResponseType<T>)
        : ([] as unknown as TableResponseType<T>),
    [data]
  )

  const indexColumns = useMemo<ColumnDef<T>[]>(
    () => [
      {
        id: "row",
        header: t("common:row"),
        accessorFn: (_, index) => digitsEnToFa(index + 1)
      }
    ],
    []
  )

  const selectableColumns = useMemo<ColumnDef<T>[]>(
    () => [
      {
        id: "selection",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllRowsSelected(value as boolean)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value as boolean)}
            disabled={!row.getCanSelect()}
          />
        )
      }
    ],
    []
  )

  const columns = useMemo<ColumnDef<T>[]>(
    () => [
      ...(indexable ? indexColumns : []),
      ...(selectable ? selectableColumns : []),
      ...columnsProp
    ],
    [indexable, selectable, columnsProp]
  )

  const table = useReactTable({
    data: serializedData?.data,
    columns,
    pageCount: serializedData?.lastPage ?? 0,
    state: {
      pagination: memoizePagination,
      rowSelection
    },
    enableRowSelection: !!selectable, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (updater) => {
      setFetchArgs((prev) => {
        const newState = typeof updater === "function" ? updater(prev) : updater
        return { ...prev, ...newState }
      })
    },
    manualPagination: true
  })

  type FilterFieldsType = TypeOf<TSchema>

  const form = useForm<FilterFieldsType>({
    resolver: zodResolver(filters?.schema),
    defaultValues: memoizedDefaultValues as DefaultValues<TypeOf<TSchema>>,
    reValidateMode: "onChange"
  })

  const onSubmit = useCallback((filter: FilterFieldsType) => {
    setFetchArgs((prev) => {
      return { ...prev, args: clearData(filter), pageIndex: 0 }
    })
  }, [])

  const onReset = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setFetchArgs({
        pageIndex: 0,
        pageSize: 10,
        args: {}
      })
      form.reset()
    },
    [form]
  )

  useEffect(() => {
    serializedDefaultForm(fetchArgs.args, form.setValue)
  }, [fetchArgs.args, form])

  useEffect(() => {
    getTableState &&
      getTableState({
        ...(paginable ? memoizePagination : {}),
        ...(selectable ? rowSelection : {}),
        data: serializedData.data
      })
  }, [memoizePagination, rowSelection, selectable])

  return (
    <>
      {filters && (
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit(onSubmit)(e)
            }}
            onReset={onReset}
            noValidate
          >
            <Filter form={form} filters={filters} />
          </form>
        </Form>
      )}
      {data ? (
        <div className="relative flex flex-col gap-y">
          {isFetching && (
            <div className="absolute inset-0 z-[99] flex h-full w-full items-center justify-center bg-alpha-50 bg-opacity-80">
              <Loading />
            </div>
          )}
          <CardContainer
            {...container}
            button={{
              ...container.button,
              disabled: container.button.disabled || isLoading || isFetching
            }}
          >
            <div className="min-h-250 overflow-x-auto">
              <table className="table-bordered table">
                <thead>
                  {table?.getHeaderGroups()?.map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                              <div>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </div>
                            )}
                          </th>
                        )
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table?.getRowModel()?.rows.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className={clsx(
                          row.getIsSelected() && "!bg-primary-50"
                        )}
                      >
                        {row.getVisibleCells()?.map((cell) => {
                          const clickable =
                            onRow &&
                            cell.column.id !== "selection" &&
                            cell.column.id !== "action"
                          return (
                            <td
                              onClick={() => {
                                if (clickable && onRow?.onClick) {
                                  onRow.onClick(row)
                                }
                              }}
                              className={clsx(
                                clickable && "relative cursor-pointer"
                              )}
                              key={cell.id}
                            >
                              {clickable && onRow?.url && (
                                <a
                                  className={clsx(
                                    "absolute inset-0 h-full w-full cursor-pointer"
                                  )}
                                  href={
                                    typeof onRow.url === "string"
                                      ? onRow.url
                                      : onRow.url(row)
                                  }
                                  aria-label={
                                    typeof onRow.url === "string"
                                      ? onRow.url
                                      : onRow.url(row)
                                  }
                                ></a>
                              )}
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {!isFetching &&
                !isLoading &&
                !table?.getRowModel()?.rows.length && (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-y-7 bg-alpha-white px-6 py-10">
                    <NotFoundIcon />
                    <p className="text-center text-alpha-500">پیدا نشد!</p>
                  </div>
                )}
            </div>
          </CardContainer>
          {paginable && (
            <TablePagination table={table} total={serializedData?.total} />
          )}
        </div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <p className="text-error">خطا!</p>
      )}
    </>
  )
}

export default Table
