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
import { parseAsInteger, useQueryStates } from "next-usequerystate"
import { useForm } from "react-hook-form"
import { TypeOf, ZodSchema } from "zod"

import { ITableProps } from "./type"

const Table = <
  T extends object,
  TSchema extends ZodSchema<any> = ZodSchema<any>
>({
  columns,
  selectable,
  fetchApiData,
  getTableState,
  accessToken = "",
  filters
}: ITableProps<T, TSchema>) => {
  const [pagination, setPagination] = useQueryStates({
    pageIndex: parseAsInteger.withDefault(0),
    pageSize: parseAsInteger.withDefault(10)
  })
  const [filter, setFilter] = useState<FilterFieldsType | undefined>(undefined)

  const [rowSelection, setRowSelection] = useState({})

  const fetchArgs: ApiArgsType<any> = useMemo(
    () => ({
      page: pagination.pageIndex + 1, // Convert to 1-based index
      perPage: pagination.pageSize,
      ...filter
    }),
    [pagination, filter]
  )

  const { data, isLoading, isFetching } = useQuery<ApiResponseType<T>>({
    queryKey: ["table", fetchArgs],
    queryFn: async () => {
      const response = await fetchApiData(fetchArgs, accessToken)
      setPagination((prev) => {
        return { ...prev, pageIndex: 0 }
      })
      setRowSelection({})
      return response
    },
    keepPreviousData: true,
    enabled: accessToken === undefined ? true : !!accessToken
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

  const {
    getHeaderGroups,
    getRowModel,
    firstPage,
    previousPage,
    getCanPreviousPage,
    nextPage,
    lastPage,
    getCanNextPage,
    getPageCount,
    getState,
    setPageIndex: setTablePageIndex,
    setPageSize: setTablePageSize
  } = useReactTable({
    data: serializedData?.data,
    columns: !!selectable ? [...columns, selectableColumns] : columns,
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
    resolver: zodResolver(filters.schema)
  })

  const onSubmit = (filter: FilterFieldsType) => {
    const temp = { ...filter }
    Object.entries(filter).forEach(([key, value]) => {
      if (!value) {
        delete temp[key]
      }
    })
    setFilter(temp)
  }

  useEffect(() => {
    getTableState({
      pagination,
      rowSelection,
      data: serializedData.data
    })
  }, [pagination, rowSelection])

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
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table>
            <thead>
              {getHeaderGroups().map((headerGroup) => (
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
              {getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
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
          <div className="flex items-center gap-2">
            <button
              className="rounded border p-1"
              onClick={() => firstPage()}
              disabled={!getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="rounded border p-1"
              onClick={() => previousPage()}
              disabled={!getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="rounded border p-1"
              onClick={() => nextPage()}
              disabled={!getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="rounded border p-1"
              onClick={() => lastPage()}
              disabled={!getCanNextPage()}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {getState().pagination.pageIndex + 1} of{" "}
                {getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  setTablePageIndex(page)
                }}
                className="w-16 rounded border p-1"
              />
            </span>
            <select
              value={getState().pagination.pageSize}
              onChange={(e) => {
                setTablePageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            {isFetching ? "Loading..." : null}
          </div>
        </>
      )}
    </>
  )
}

export default Table
