import { useCallback } from "react"
import { Button } from "@vardast/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { SelectPopover } from "@vardast/ui/select-popover"
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import { clsx } from "clsx"
import useTranslation from "next-translate/useTranslation"
import { ZodType } from "zod"

import Card from "../Card"
import { FilterComponentTypeEnum, IFilterProps, RenderItemType } from "./type"

const Filter = <T extends ZodType<any, any, any>>({
  form,
  filters
}: IFilterProps<T>) => {
  const { t } = useTranslation()

  const renderItem: RenderItemType<T> = useCallback(
    (filter, value) => {
      if (filter.type === FilterComponentTypeEnum.INPUT) {
        return (
          <Input
            placeholder={t("common:entity_enter_placeholder", {
              entity: filter.title
            })}
            type={filter.inputType || "text"}
            onChange={(e) => {
              form.setValue(filter.name as any, e.target.value as any)
            }}
            {...form.register(filter.name as any)}
          />
        )
      }
      if (filter.type === FilterComponentTypeEnum.SELECT) {
        return (
          <SelectPopover
            loading={filter.loading}
            options={filter.options}
            setSearch={filter.setSearch}
            value={value}
            onSelect={(value) => {
              form.setValue(filter.name as any, value.toUpperCase() as any, {
                shouldDirty: true
              })
            }}
          />
        )
      }
      if (filter.type === FilterComponentTypeEnum.TOGGLE) {
        return (
          <ToggleGroup
            className="grid grid-cols-2 rounded-md bg-alpha-50 p-1"
            type="single"
            value={value}
            onValueChange={(value) => {
              form.setValue(
                filter.name as any,
                (value === undefined ? value : value === "true") as any,
                {
                  shouldDirty: true
                }
              )
            }}
          >
            <ToggleGroupItem
              className={clsx(
                "bg-inherit py-2 text-base text-alpha-500",
                (value as unknown as boolean) === true &&
                  "!bg-alpha-white !text-alpha-800  shadow-lg"
              )}
              disabled={filter.loading}
              value={"true"}
            >
              {filter?.optionsTitle?.true || "دارد"}
            </ToggleGroupItem>
            <ToggleGroupItem
              className={clsx(
                "bg-inherit py-2 text-base text-alpha-500",
                (value as unknown as boolean) === false &&
                  "!bg-alpha-white !text-alpha-800 shadow-lg"
              )}
              disabled={filter.loading}
              value={"false"}
            >
              {filter?.optionsTitle?.false || "ندارد"}
            </ToggleGroupItem>
          </ToggleGroup>
        )
      }
    },
    [
      filters,
      form.formState.isLoading ||
        form.formState.isSubmitting ||
        form.formState.isDirty
    ]
  )

  return (
    <Card className="flex flex-col justify-between gap-4 p-4">
      <div className="grid gap sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filters.options?.map((filter) => (
          <FormField
            control={form.control}
            key={filter.title}
            name={filter.name as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{filter.title}</FormLabel>
                <FormControl>{renderItem(filter, field.value)}</FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      <div className="col-span-full flex flex-col gap sm:flex-row sm:justify-end">
        <Button
          className="py-2"
          disabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            !form.formState.isDirty
          }
          loading={form.formState.isSubmitting || form.formState.isLoading}
          size="medium"
          type="reset"
          variant="secondary"
        >
          حذف فیلتر
        </Button>
        <Button
          className="py-2"
          disabled={form.formState.isSubmitting || form.formState.isLoading}
          loading={form.formState.isSubmitting || form.formState.isLoading}
          size="medium"
          type="submit"
        >
          اعمال فیلتر
        </Button>
      </div>
    </Card>
  )
}

Filter.displayNam = "Filter"

export { Filter }
