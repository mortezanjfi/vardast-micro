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

  const renderItem: RenderItemType<T> = (filter, value) => {
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
            form.setValue(filter.name as any, value.toUpperCase() as any)
          }}
          options={filter.options}
          value={value}
        />
      )
    }
  }

  return (
    <Card className="flex flex-col justify-between gap-6 p-6">
      <div className="grid grid-cols-4 gap-6">
        {filters.options?.map((filter) => (
          <FormField
            control={form.control}
            name={filter.name as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{filter.title}</FormLabel>
                <FormControl>
                  {renderItem(filter, field.value as string)}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      <div className="col-start-4 flex justify-end gap-3">
        <Button
          size="medium"
          variant="outline-primary"
          className="py-2"
          disabled={form.formState.isSubmitting}
          loading={form.formState.isSubmitting}
          onClick={() => {
            form.reset()
          }}
        >
          حذف فیلتر
        </Button>
        <Button
          size="medium"
          className="py-2"
          loading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          type="submit"
        >
          اعمال فیلتر
        </Button>
      </div>
    </Card>
  )
}

export default Filter
