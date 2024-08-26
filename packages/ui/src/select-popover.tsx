"use client"

import { HtmlHTMLAttributes, useEffect, useRef, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import clsx from "clsx"
import { ChevronDown, LucideCheck, RefreshCcw } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { ButtonProps } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export type SelectPopoverPropsType = {
  value?: string
  onSelect: (value: string) => void
  options: { key: string; value: string }[]
  loading?: boolean
  disabled?: boolean
  setSearch?: (query?: string) => void
  internalSearchable?: boolean
}

const SelectPopoverTrigger = ({
  loading,
  disabled,
  label,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement> &
  ButtonProps & {
    label?: string
  }) => {
  return (
    <div
      {...props}
      aria-disabled={disabled || loading}
      className={mergeClasses(
        "input-field flex w-full cursor-pointer items-center text-start",
        props.className
      )}
      role="combobox"
      style={{ pointerEvents: disabled || loading ? "none" : "auto" }}
    >
      <span className="truncate">{label}</span>
      {loading ? (
        <RefreshCcw className="ms-auto h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <ChevronDown className="ms-auto h-4 w-4 shrink-0" />
      )}
    </div>
  )
}

SelectPopoverTrigger.displayName = "SelectPopoverTrigger"

const SelectPopover = ({
  value,
  options,
  onSelect,
  loading,
  disabled,
  setSearch,
  internalSearchable
}: SelectPopoverPropsType) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [internalSearch, setInternalSearch] = useState("")
  const [label, setLabel] = useState("")
  const [query, setQuery] = useDebouncedState<string>("", 500)
  const [queryTemp, setQueryTemp] = useState<string>("")
  const { t } = useTranslation()
  const customContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (setSearch) {
      setSearch(query)
    }
  }, [setSearch, query])

  useEffect(() => {
    setLabel(() =>
      value
        ? loading
          ? "در حال بارگزاری..."
          : options?.find((item) => item.value === value)?.key ||
            t("common:select_placeholder")
        : t("common:select_placeholder")
    )
  }, [value, label, options, loading])

  return (
    <>
      <div className="z-[99999999]" ref={customContainerRef} />
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger
          className={clsx(
            "w-full",
            (disabled || loading || !options?.length) &&
              "btn-disabled btn btn-link hover:!no-underline"
          )}
          disabled={disabled || loading || !options?.length}
        >
          <SelectPopoverTrigger
            disabled={disabled || loading || !options?.length}
            label={label}
            loading={loading}
          />
        </PopoverTrigger>
        <PopoverContent container={customContainerRef.current}>
          <Command
            filter={(value, search) => {
              if (
                options
                  ?.find((item) => item.value.includes(value))
                  ?.key.includes(search)
              )
                return 1
              return 0
            }}
          >
            {(setSearch || internalSearchable) && (
              <>
                {setSearch && (
                  <CommandInput
                    loading={loading}
                    placeholder={"جستجو"}
                    value={queryTemp}
                    onValueChange={(e) => {
                      setQueryTemp(e)
                      setQuery(e)
                    }}
                  />
                )}
                {internalSearchable && (
                  <CommandInput
                    loading={loading}
                    placeholder={"جستجو"}
                    value={internalSearch}
                    onValueChange={setInternalSearch}
                  />
                )}
              </>
            )}
            <CommandEmpty>یافت نشد</CommandEmpty>
            <CommandGroup>
              {options?.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
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
    </>
  )
}

SelectPopover.displayName = "SelectPopover"

export { SelectPopover, SelectPopoverTrigger }
