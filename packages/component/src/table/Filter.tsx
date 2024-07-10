import { PropsWithChildren } from "react"
import { Button } from "@vardast/ui/button"

import Card from "../Card"
import { IFilterProps } from "./type"

const Filter = <T,>({ form, children }: PropsWithChildren<IFilterProps<T>>) => {
  return (
    <Card>
      <div className="flex flex-col justify-between gap-6">
        <div className="grid grid-cols-4 gap-6">{children}</div>
        <div className="col-start-4 flex justify-end gap-3">
          <Button
            size="medium"
            variant="outline-primary"
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
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            type="submit"
          >
            اعمال فیلتر
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default Filter
