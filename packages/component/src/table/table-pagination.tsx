import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { Table } from "@tanstack/react-table"
import { Button } from "@vardast/ui/button"
import { Command, CommandGroup, CommandItem } from "@vardast/ui/command"
import { Input } from "@vardast/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"

import DynamicHeroIcon from "../DynamicHeroIcon"

type Props<T> = {
  table: Table<T>
  total?: number
}
const pageSizeOptions = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
  { value: "50", label: "50" },
  { value: "100", label: "100" }
]
const TablePagination = <T,>({ table, total }: Props<T>) => {
  const [pageSizeModalOpen, setPageSizeModalOpen] = useState<boolean>(false)
  const {
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
  } = table

  // const pageRange = useCallback(() => {
  //   const range = []
  //   if (getPageCount() <= 10) {
  //     for (let i = 1; i <= getPageCount(); i++) {
  //       range.push(i)
  //     }
  //   } else {
  //     const start = Math.max(1, getState().pagination.pageIndex - 4)
  //     const end = Math.min(getPageCount(), getState().pagination.pageIndex + 4)

  //     for (let i = start; i <= end; i++) {
  //       range.push(i)
  //     }

  //     if (start > 1) {
  //       range.unshift("...")
  //       range.unshift(1)
  //     }

  //     if (end < getPageCount()) {
  //       range.push("...")
  //       range.push(getPageCount())
  //     }
  //   }
  //   return range
  // }, [])

  return (
    <div className="flex justify-start pt">
      <div className="flex items-center justify-start gap-10">
        <div className="flex items-center gap">
          <p>برو به صفحه:</p>
          <Input
            className="w-16"
            disabled={getState().pagination.pageIndex + 1 === getPageCount()}
            value={digitsEnToFa(getState().pagination.pageIndex + 1 || 0)}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              setTablePageIndex(page)
            }}
          />
        </div>

        <div className="flex items-center gap">
          <Button
            variant="secondary"
            // size="small"
            iconOnly
            onClick={() => firstPage()}
            disabled={!getCanPreviousPage()}
          >
            <DynamicHeroIcon
              icon="ChevronDoubleRightIcon"
              className="icon h-7 w-7 transform transition-all"
            />
          </Button>
          <Button
            variant="secondary"
            // size="small"
            iconOnly
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
          >
            <DynamicHeroIcon
              icon="ChevronRightIcon"
              className="icon h-7 w-7 transform transition-all"
            />
          </Button>
          <div className="flex items-center gap-2">
            <p className="font-medium">
              {digitsEnToFa(getState().pagination.pageIndex + 1) || 0}
            </p>
            <p>از</p>
            <p className="font-medium">
              {digitsEnToFa(getPageCount().toLocaleString() || 0)}
            </p>
            {/* {pageRange().map((page, index) => (
              <Button
                key={index}
                variant="secondary"
                onClick={() => {
                  if (typeof page === "number") {
                    setTablePageIndex(page - 1)
                  }
                }}
                disabled={getState().pagination.pageIndex === page - 1}
              >
                {digitsEnToFa(page || 0)}
              </Button>
            ))} */}
          </div>
          <Button
            variant="secondary"
            // size="small"
            iconOnly
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
          >
            <DynamicHeroIcon
              icon="ChevronLeftIcon"
              className="icon h-7 w-7 transform transition-all"
            />
          </Button>
          <Button
            variant="secondary"
            // size="small"
            iconOnly
            onClick={() => lastPage()}
            disabled={!getCanNextPage()}
          >
            <DynamicHeroIcon
              icon="ChevronDoubleLeftIcon"
              className="icon h-7 w-7 transform transition-all"
            />
          </Button>
        </div>
        <Popover open={pageSizeModalOpen} onOpenChange={setPageSizeModalOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center gap">
              <span>تعداد:</span>
              <Button
                noStyle
                // size="small"
                role="combobox"
                className="input-field flex items-center gap-1"
              >
                {digitsEnToFa(getState().pagination.pageSize || 0)}
                <DynamicHeroIcon
                  icon="ChevronDownIcon"
                  className="icon h-4 w-4"
                />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandGroup>
                {pageSizeOptions
                  .filter((item, index) => +item.value <= total || index < 2)
                  .map((option) => (
                    <CommandItem
                      value={option.value}
                      key={option.value}
                      onSelect={(value) => {
                        setTablePageSize(Number(value))
                        setPageSizeModalOpen(false)
                      }}
                    >
                      {digitsEnToFa(option.label || 0)}
                      {+option.value === getState().pagination.pageSize && (
                        <DynamicHeroIcon icon="CheckIcon" className="h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex items-center gap-1">
          <p>تعداد کل:</p>
          <p className="font-medium">{digitsEnToFa(total || 0)}</p>
        </div>
      </div>
    </div>
  )
}

TablePagination.displayName = "TablePagination"

export { TablePagination }
