"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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
import { ApiArgsType, TableResponseType } from "@vardast/query/type"
import { Checkbox } from "@vardast/ui/checkbox"
import { Form } from "@vardast/ui/form"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import { clsx } from "clsx"
import useTranslation from "next-translate/useTranslation"
import {
  createParser,
  parseAsInteger,
  useQueryStates
} from "next-usequerystate"
import { DefaultValues, useForm } from "react-hook-form"
import { AnyZodObject, TypeOf, ZodDefault, ZodSchema } from "zod"

import Card from "../Card"
import Link from "../Link"
import Loading from "../Loading"
import NotFoundIcon from "../not-found-icon"
import Filter from "./Filter"
import TablePagination from "./TablePagination"
import { ITableProps } from "./type"

const filtersParser = createParser({
  parse: (value) => (value ? JSON.parse(value) : {}),
  serialize: (value) => JSON.stringify(value)
})

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

const getConvertedApiData = (data) => {
  return data[Object.keys(data)[0]]
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
  internalArgs,
  indexable = true,
  fetch,
  handleResponse,
  getTableState,
  container,
  filters
}: ITableProps<T, TSchema>) => {
  const router = useRouter()
  const pathname = usePathname()
  const [fetchArgs, setFetchArgs] = useQueryStates(
    fetch?.directData?.data
      ? {}
      : {
          pageIndex: parseAsInteger.withDefault(0),
          pageSize: parseAsInteger.withDefault(10),
          args: filtersParser.withDefault({})
        }
  )
  const { t } = useTranslation()
  const [rowSelection, setRowSelection] = useState({})

  const memoizeFetchArgs: ApiArgsType<TSchema> =
    internalArgs ??
    useMemo(() => {
      const args = convertArgsToNumber(fetchArgs.args)
      return {
        ...(paginable
          ? { page: fetchArgs.pageIndex + 1, perPage: fetchArgs.pageSize }
          : {}),
        ...args
      }
    }, [fetchArgs.pageIndex, fetchArgs.pageSize, fetchArgs.args, internalArgs])

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

  const { data, isLoading, isFetching, isError } = useQuery(
    [name, "table", memoizeFetchArgs, fetch?.directData?.data],
    async () => {
      let response: Partial<T>[]
      // console.log("Starting data fetch...")

      if (fetch?.directData?.data) {
        response = fetch.directData.data
        // console.log("Using direct data:", response)
      } else if (fetch?.api) {
        try {
          // console.log("Fetching data from API with args:", memoizeFetchArgs)
          response = await fetch.api(memoizeFetchArgs)
          // console.log("API response:", response)
        } catch (error) {
          // console.log("API error:", error)
          throw new Error("Failed to fetch data from API")
        }
      } else {
        // console.log("No direct data or API to fetch data from")
      }

      if (!response) {
        throw new Error("No data fetched")
      }

      if (handleResponse) {
        const handledResponse = handleResponse(getConvertedApiData(response))
        // console.log("Handled response:", handledResponse)
        return handledResponse
      }

      // console.log("Final response:", response)
      setRowSelection({})
      return response
    },
    {
      keepPreviousData: true
    }
  )

  const serializedData = useMemo(
    () =>
      data
        ? handleResponse
          ? ({ data } as unknown as TableResponseType<T>)
          : fetch?.directData?.data
            ? ({
                data: fetch?.directData?.data
              } as unknown as TableResponseType<T>)
            : (data[Object.keys(data)[0]] as unknown as TableResponseType<T>)
        : ([] as unknown as TableResponseType<T>),
    [data, handleResponse]
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
      ...(selectable ? selectableColumns : []),
      ...(indexable ? indexColumns : []),
      ...columnsProp
    ],
    [indexable, selectable, columnsProp]
  )

  const useTableProps = {
    data: serializedData?.data,
    columns,
    pageCount: serializedData?.lastPage ?? 0,
    state: {
      rowSelection
    },
    enableRowSelection: !!selectable, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  }

  const table = useReactTable(
    paginable
      ? {
          ...useTableProps,
          state: { ...useTableProps.state, pagination: memoizePagination },
          getPaginationRowModel: getPaginationRowModel(),
          onPaginationChange: (updater) => {
            setFetchArgs((prev) => {
              const newState =
                typeof updater === "function"
                  ? updater(prev as PaginationState)
                  : updater
              return { ...prev, ...newState }
            })
          },
          manualPagination: true
        }
      : useTableProps
  )

  type FilterFieldsType = TypeOf<TSchema>

  const form = useForm<FilterFieldsType>({
    resolver: zodResolver(filters?.schema),
    defaultValues: memoizedDefaultValues as DefaultValues<TypeOf<TSchema>>,
    reValidateMode: "onChange"
  })

  const onSubmit = useCallback((filter: FilterFieldsType) => {
    if (!fetch?.directData) {
      setFetchArgs((prev) => {
        return { ...prev, args: clearData(filter), pageIndex: 0 }
      })
    }
  }, [])

  const onReset = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      if (!fetch?.directData) {
        e.preventDefault()
        setFetchArgs({})
        form.reset()
        router.push(pathname)
      }
    },
    [form]
  )

  useEffect(() => {
    setMultiFormValues(fetchArgs.args, form.setValue)
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
            className="pb-6"
            onReset={onReset}
            noValidate
          >
            <Filter form={form} filters={filters} />
          </form>
        </Form>
      )}
      <div className="relative flex flex-col gap-y overflow-hidden">
        <Card
          className={clsx(!container?.title && "!p-0")}
          {...container}
          button={
            container && {
              ...container?.button,
              disabled:
                container?.button?.disabled ||
                isLoading ||
                fetch?.directData?.directLoading ||
                isFetching
            }
          }
        >
          {data ? (
            <>
              <div className="min-h-250 overflow-x-auto">
                <table className="table-bordered table">
                  <thead>
                    {table?.getHeaderGroups()?.map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <th
                              className={clsx(header.id === "row" && "w-16")}
                              key={header.id}
                              colSpan={header.colSpan}
                            >
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
                    {table?.getRowModel()?.rows?.map((row) => {
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
                                  clickable && "relative cursor-pointer",
                                  cell.column.id === "row" &&
                                    "!px-2 text-center"
                                )}
                                key={cell.id}
                              >
                                {clickable && onRow?.url && (
                                  <Link
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
                                  ></Link>
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
                  !(isLoading || fetch?.directData?.directLoading) &&
                  !table?.getRowModel()?.rows?.length && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-y-7 bg-alpha-white px-6 py-10">
                      <NotFoundIcon />
                      <p className="text-center text-alpha-500">پیدا نشد!</p>
                    </div>
                  )}
              </div>
              {paginable && (
                <TablePagination table={table} total={serializedData?.total} />
              )}
            </>
          ) : isLoading || fetch?.directData?.directLoading ? (
            <Loading />
          ) : (
            isError && <p className="text-error">خطا!</p>
          )}
          {data && isFetching && (
            <div className="absolute inset-0 z-[99] flex h-full w-full items-center justify-center bg-alpha-50 bg-opacity-80">
              <Loading />
            </div>
          )}
        </Card>
      </div>
    </>
  )
}

export default Table
