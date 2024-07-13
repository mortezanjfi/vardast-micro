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

  return (
    <div className="flex justify-start">
      <div className="flex items-center justify-start gap-10">
        <div className="flex items-center gap">
          <p>برو به صفحه:</p>
          <Input
            className="w-16"
            value={digitsEnToFa(getState().pagination.pageIndex + 1)}
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
              {digitsEnToFa(getState().pagination.pageIndex + 1)}
            </p>
            <p>از</p>
            <p className="font-medium">
              {digitsEnToFa(getPageCount().toLocaleString())}
            </p>
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
                {digitsEnToFa(getState().pagination.pageSize)}
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
                  .filter((item) => +item.value <= total)
                  .map((option) => (
                    <CommandItem
                      value={option.value}
                      key={option.value}
                      onSelect={(value) => {
                        setTablePageSize(Number(value))
                        setPageSizeModalOpen(false)
                      }}
                    >
                      {digitsEnToFa(option.label)}
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
          <p className="font-medium">{digitsEnToFa(total)}</p>
        </div>
      </div>
    </div>
  )
}

export default TablePagination
