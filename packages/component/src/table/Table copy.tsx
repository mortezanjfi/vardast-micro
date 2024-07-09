import { useEffect, useState } from "react"
import Loading from "@/Loading"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Checkbox } from "@vardast/ui/src/checkbox"
import { useForm } from "react-hook-form"
import { usePagination, useRowSelect, useTable } from "react-table"

import { IMyTableProps } from "./type"

export interface IPageSizeOptions {
  readonly value: string
  readonly label: string
}

export const pageSizeOptions: IPageSizeOptions[] = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" }
]

const tableCell = "p-14 text-sm"

const MyTable: React.FC<IMyTableProps> = ({
  tableName,
  filterOption,
  queryFn,
  handleResponse,
  columns,
  rowSelect = undefined,
  extraComponent
}) => {
  const initialTable = filterOption
    ? {
        pageSize: 10,
        pageIndex: 0,
        filters: filterOption?.initialFilter ?? {}
      }
    : { pageSize: 10, pageIndex: 0 }

  const [query, setQuery] = useState(initialTable)

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { isDirty, errors }
  } = useForm({
    resolver: zodResolver(filterOption?.schema),
    defaultValues: query.filters
  })

  console.log({ errors })

  const onSubmit = (data: any) => {
    setQuery({
      pageSize: 10,
      pageIndex: 0,
      filters: data
    })
  }
  const { isSuccess, isFetching, data } = useQuery(
    [tableName, query.pageIndex, query.pageSize, query.filters],
    async () => {
      const response: any = await queryFn({
        pageSize: state.pageSize,
        pageNumber: state.pageIndex + 1,
        ...query.filters
      })
      if (rowSelect) {
        toggleAllRowsSelected(false)
      }

      return handleResponse(response)
    },
    {
      keepPreviousData: true
    }
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    selectedFlatRows,
    toggleAllRowsSelected
  } = useTable(
    {
      columns,
      data: isSuccess ? data?.result || [] : [],
      manualPagination: true,
      pageCount: isSuccess
        ? Math.ceil(data?.totalCount / query?.pageSize)
        : undefined,
      autoResetSelectedRows: false
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      if (rowSelect) {
        hooks.visibleColumns.push((columns) => {
          return [
            {
              id: "selection",
              Header: ({ getToggleAllRowsSelectedProps }) => (
                <Checkbox
                  checked={getToggleAllRowsSelectedProps()?.checked}
                  onCheckedChange={getToggleAllRowsSelectedProps()?.onChange}
                />
              ),
              Cell: ({ row }) => (
                <Checkbox
                  checked={row.getToggleRowSelectedProps()?.checked}
                  onCheckedChange={row.getToggleRowSelectedProps()?.onChange}
                />
              )
            },
            ...columns
          ]
        })
      }
    }
  )

  const resetAll = () => {
    setQuery(initialTable)
    reset()
  }

  useEffect(() => {
    if (query.filters && Object.keys(query.filters).length) {
      gotoPage(0)
      setPageSize(10)
    }
  }, [gotoPage, query.filters, setPageSize])

  return (
    <>
      {filterOption && (
        <filterOption.Component
          register={register}
          onSubmit={handleSubmit(onSubmit)}
          control={control}
          isLoading={isFetching}
          watch={watch}
          setValue={setValue}
          isDirty={isDirty}
          reset={resetAll}
          setQuery={setQuery}
          errors={errors}
        />
      )}
      {extraComponent && (
        <extraComponent.Component
          resetAll={resetAll}
          selectedFlatRows={selectedFlatRows}
        />
      )}
      <div className="space-y-20">
        <div className="rounded-base shadow-base min-h-250 relative overflow-x-scroll">
          {isFetching && (
            <div className="bg-gray-opacity-50 z-docked absolute left-0 top-0 flex h-full w-full items-center justify-center">
              <Loading />
            </div>
          )}
          <table
            className="w-full bg-primary-500 text-right "
            {...getTableProps()}
          >
            <thead className="w-full bg-primary-500 text-white">
              {headerGroups.map((headerGroup: any, index: number) => (
                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any, index: number) => (
                    <th
                      className={`${tableCell} border-gray-opacity-20 text-center`}
                      key={index}
                      {...column.getHeaderProps()}
                    >
                      {column.render("Header") ?? ""}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row: any, index: number) => {
                prepareRow(row)
                return (
                  <tr
                    className="odd:bg-gray-50 even:bg-gray-100 hover:bg-gray-200"
                    key={index}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell: any, index2: number) => {
                      return (
                        <td
                          className={`${tableCell} text-center ${
                            index === 0 &&
                            "first:rounded-tr-base last:rounded-tl-base"
                          }`}
                          key={index2}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell").props.value !== "undefined" ? (
                            cell.render("Cell")
                          ) : (
                            <span className="text-center text-gray-400">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!page.length && (
            <div className="w-full bg-white py-40 text-center">
              {isFetching ? (
                <p>در حال دریافت اطلاعات ...</p>
              ) : (
                <p>داده ای یافت نشد</p>
              )}
            </div>
          )}
        </div>

        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>
          <span>
            Page{" "}
            <strong>
              {state.pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={state.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: "100px" }}
            />
          </span>
          <select
            value={pageCount}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <pre>
          <code>
            {JSON.stringify(
              selectedFlatRows.map((row) => row.original),
              null,
              2
            )}
          </code>
        </pre>
      </div>
    </>
  )
}

export default MyTable
