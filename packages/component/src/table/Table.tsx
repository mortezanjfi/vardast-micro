"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { parseAsInteger, useQueryStates } from "next-usequerystate"
import { useForm } from "react-hook-form"
import { TypeOf, ZodSchema } from "zod"

import CardContainer from "../desktop/CardContainer"
import Loading from "../Loading"
import TablePagination from "./TablePagination"
import { ITableProps } from "./type"

const Table = <
  T extends object,
  TSchema extends ZodSchema<any> = ZodSchema<any>
>({
  name,
  columns,
  onRow,
  paginable,
  selectable,
  fetch,
  handleResponse,
  getTableState,
  container,
  filters
}: ITableProps<T, TSchema>) => {
  const [pagination, setPagination] = useQueryStates({
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(10)
  })
  const [filter, setFilter] = useState<FilterFieldsType | undefined>(undefined)
  const [rowSelection, setRowSelection] = useState({})
  const { data: session } = useSession()

  const fetchArgs: ApiArgsType<any> = useMemo(
    () => ({
      page: pagination.pageIndex + 1, // Convert to 1-based index
      perPage: pagination.pageSize,
      ...filter
    }),
    [pagination, filter]
  )

  const { data, isLoading, isFetching } = useQuery<ApiResponseType<T>>({
    queryKey: [name, "table", fetchArgs],
    queryFn: async () => {
      const response = await fetch.api(
        fetchArgs,
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

  const selectableColumns = useMemo<ColumnDef<T>>(
    () =>
      !!selectable && {
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
      },
    []
  )

  const table = useReactTable({
    data: serializedData?.data,
    columns: !!selectable ? [selectableColumns, ...columns] : columns,
    pageCount: serializedData?.lastPage ?? 0,
    state: {
      pagination,
      rowSelection
    },
    enableRowSelection: !!selectable, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (updater) => {
      setPagination((prev) => {
        const newState = typeof updater === "function" ? updater(prev) : updater
        return { ...prev, ...newState }
      })
    },
    manualPagination: true //we're doing manual "server-side" pagination
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true
  })

  type FilterFieldsType = TypeOf<TSchema>

  const form = useForm<FilterFieldsType>({
    resolver: zodResolver(filters?.schema)
  })

  const onSubmit = (filter: FilterFieldsType) => {
    const temp = { ...filter }
    Object.entries(filter).forEach(([key, value]) => {
      if (!value) {
        delete temp[key]
      }
    })
    setPagination((prev) => {
      return { ...prev, pageIndex: 0 }
    })
    setFilter(temp)
  }

  useEffect(() => {
    getTableState &&
      getTableState({
        ...(paginable ? { pagination } : {}),
        ...(selectable ? { rowSelection } : {}),
        data: serializedData.data
      })
  }, [pagination, rowSelection, selectable])

  return (
    <>
      {filters && (
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit(onSubmit)(e)
            }}
            noValidate
          >
            <filters.Component form={form} />
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
            className="min-h-250 overflow-x-auto py-6"
          >
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
                      className={clsx(row.getIsSelected() && "!bg-primary-50")}
                    >
                      {row.getVisibleCells()?.map((cell) => {
                        const clickable =
                          onRow && cell.column.id !== "selection"
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
          </CardContainer>
          {paginable && (
            <TablePagination table={table} total={serializedData?.total} />
          )}
        </div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <p>داده ای یافت نشد</p>
      )}
    </>
  )
}

export default Table
