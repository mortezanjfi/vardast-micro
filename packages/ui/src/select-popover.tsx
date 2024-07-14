"use client"

import { useState } from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { Button } from "./button"
import { Command, CommandEmpty, CommandGroup, CommandItem } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

type Props = {
  value?: string
  options: { key: string; value: string }[]
  onSelect: (value: string) => void
}

const SelectPopover = ({ value, options, onSelect }: Props) => {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const { t } = useTranslation()

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          noStyle
          role="combobox"
          className="input-field flex items-center text-start"
        >
          {value
            ? options.find((item) => item.value === value)?.key
            : t("common:select_placeholder")}
          <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          {/* <CommandInput
            placeholder={t("common:search_entity", {
              entity: t("common:uom")
            })}
          /> */}
          <CommandEmpty>
            {t("common:no_entity_found", {
              entity: t("common:uom")
            })}
          </CommandEmpty>
          <CommandGroup>
            {options.map((item) => (
              <CommandItem
                value={item.value}
                key={item.value}
                onSelect={(value) => {
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
