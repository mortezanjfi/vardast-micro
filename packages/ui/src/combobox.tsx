import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { ControllerRenderProps } from "react-hook-form"

import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "./command"
import { FormControl } from "./form"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface ComboBoxProps extends ControllerRenderProps {
  items: Record<string, any>[]
  filterKey: string
  labelKey: string
  triggerPlaceholder?: string
  searchPlaceholder?: string
  noResultText?: string
}

const ComboBox = ({
  items,
  filterKey,
  labelKey,
  onChange,
  triggerPlaceholder,
  searchPlaceholder,
  noResultText,
  ...props
}: ComboBoxProps) => {
  const { t } = useTranslation()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            className="input-field flex items-center text-start"
            noStyle
            role="combobox"
          >
            {props.value
              ? items.find((item) => item[filterKey] === props.value)?.[
                  labelKey
                ]
              : triggerPlaceholder ?? t("common:select_placeholder")}
            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0 text-alpha-500" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder || t("common:search")} />
          <CommandEmpty>{noResultText || t("common:no_result")}</CommandEmpty>
          <CommandGroup className="max-h-[100px] overflow-auto">
            {items.map((item) => (
              <CommandItem
                key={item[filterKey]}
                value={item[filterKey]}
                onSelect={onChange}
              >
                <LucideCheck
                  className={mergeClasses(
                    "mr-2 h-4 w-4",
                    item[filterKey] === props.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {item[labelKey]}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
ComboBox.displayName = "ComboBox"

export { ComboBox }
