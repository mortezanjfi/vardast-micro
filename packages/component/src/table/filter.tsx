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
            type="text"
            placeholder={t("common:entity_enter_placeholder", {
              entity: filter.title
            })}
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
            onSelect={(value) => {
              form.setValue(filter.name as any, value.toUpperCase() as any, {
                shouldDirty: true
              })
            }}
            loading={filter.loading}
            setSearch={filter.setSearch}
            options={filter.options}
            value={value}
          />
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
    <Card className="flex flex-col justify-between gap-6 p-6">
      <div className="grid gap sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filters.options?.map((filter) => (
          <FormField
            key={filter.title}
            control={form.control}
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
          size="medium"
          variant="outline-primary"
          type="reset"
          className="py-2"
          disabled={
            form.formState.isSubmitting ||
            form.formState.isLoading ||
            !form.formState.isDirty
          }
          loading={form.formState.isSubmitting || form.formState.isLoading}
        >
          حذف فیلتر
        </Button>
        <Button
          size="medium"
          className="py-2"
          loading={form.formState.isSubmitting || form.formState.isLoading}
          disabled={form.formState.isSubmitting || form.formState.isLoading}
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
