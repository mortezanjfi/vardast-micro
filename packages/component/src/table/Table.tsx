"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import {
  ApiArgsType,
  ApiResponseType,
  TableResponseType
} from "@vardast/query/type"
import { Form } from "@vardast/ui/form"
import { useForm } from "react-hook-form"
import { usePagination, useTable } from "react-table"
import { TypeOf, ZodSchema } from "zod"

import { ITableProps } from "./type"

const Table = <
  T extends object,
  TSchema extends ZodSchema<any> = ZodSchema<any>
>({
  columns,
  fetchApiData,
  accessToken = "",
  handleResponse,
  filters
}: ITableProps<T, TSchema>) => {
  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(16)
  const [filter, setFilter] = useState<{} | undefined>(undefined)

  const fetchArgs: ApiArgsType<any> = {
    page: page + 1, // Convert to 1-based index
    perPage: pageSize,
    ...filter
  }

  type FilterFieldsType = TypeOf<TSchema>

  const form = useForm<FilterFieldsType>({
    resolver: zodResolver(filters.schema)
  })

  const { data, isLoading } = useQuery<ApiResponseType<T>>({
    queryKey: ["table", fetchArgs],
    queryFn: async () => {
      const response = await fetchApiData(fetchArgs, accessToken)

      if (handleResponse) {
        handleResponse(
          response[Object.keys(response)[0]] as unknown as TableResponseType<T>
        )
      }
      return response
    },
    keepPreviousData: true,
    enabled: accessToken === undefined ? true : !!accessToken
  })

  const key = data ? Object.keys(data)[0] : null
  const finalData = key ? data[key] : null

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: tablePage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex },
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: updatePageSize
  } = useTable<T>(
    {
      columns,
      data: finalData?.data ?? [],
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: finalData?.lastPage ?? 0
    },
    usePagination
  )

  const onSubmit = (filter: {}) => {
    const temp = { ...filter }
    Object.entries(filter).forEach(([key, value]) => {
      if (!value) {
        delete temp[key]
      }
    })
    setFilter(temp)
    setPage(0) // Reset to first page on filter change
  }

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
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {tablePage.map((row) => {
                prepareRow(row)
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div>
            <button
              onClick={() => {
                setPage(0)
                gotoPage(0)
              }}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </button>
            <button
              onClick={() => {
                setPage(pageIndex - 1)
                previousPage()
              }}
              disabled={!canPreviousPage}
            >
              {"<"}
            </button>
            <button
              onClick={() => {
                setPage(pageIndex + 1)
                nextPage()
              }}
              disabled={!canNextPage}
            >
              {">"}
            </button>
            <button
              onClick={() => {
                setPage(pageOptions.length - 1)
                gotoPage(pageOptions.length - 1)
              }}
              disabled={!canNextPage}
            >
              {">>"}
            </button>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <span>
              | Go to page:{" "}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  setPage(page)
                  gotoPage(page)
                }}
                style={{ width: "100px" }}
              />
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                updatePageSize(Number(e.target.value))
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </>
  )
}

export default Table
