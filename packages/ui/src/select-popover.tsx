"use client"

import { useEffect, useState } from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { LucideCheck, LucideChevronsUpDown, RefreshCcw } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { Button } from "./button"
import { Command, CommandGroup, CommandItem } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export type SelectPopoverPropsType = {
  value?: string
  onSelect: (value: string) => void
  options: { key: string; value: string }[]
  loading?: boolean
  setSearch?: (query?: string) => void
}

const SelectPopover = ({
  value,
  options,
  onSelect,
  loading
  // setSearch
}: SelectPopoverPropsType) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [label, setLabel] = useState("")
  // const [query, setQuery] = useDebouncedState<string>("", 500)
  // const [queryTemp, setQueryTemp] = useState<string>("")
  const { t } = useTranslation()

  // useEffect(() => {
  //   if (setSearch) {
  //     setSearch(query)
  //   }
  // }, [query, setSearch])

  useEffect(() => {
    setLabel(() =>
      !!value
        ? loading
          ? "در حال بارگزاری..."
          : options.find((item) => item.value === value)?.key
        : t("common:select_placeholder")
    )
  }, [value, label, options, loading])

  // console.log({ value, label })

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          noStyle
          disabled={loading}
          role="combobox"
          className="input-field flex items-center text-start"
        >
          {loading ? (
            <>
              در حال بارگزاری...
              <RefreshCcw className="ms-auto h-4 w-4 shrink-0 animate-spin" />
            </>
          ) : (
            <>
              {label}
              <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          {/* {setSearch && (
            <CommandInput
              loading={loading}
              value={queryTemp}
              onValueChange={(newQuery) => {
                setQuery(newQuery)
                setQueryTemp(newQuery)
              }}
              placeholder={"جستجو"}
            />
          )}
          <CommandEmpty>یافت نشد</CommandEmpty> */}
          <CommandGroup>
            {options?.map((item) => (
              <CommandItem
                value={item.value}
                key={item.value}
                onSelect={(value) => {
                  setLabel(item.key)
                  onSelect(value)
                  setPopoverOpen(false)
                }}
              >
                <LucideCheck
                  className={mergeClasses(
                    "mr-2 h-4 w-4",
                    item.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.key}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

SelectPopover.displayName = "SelectPopover"

export { SelectPopover }
