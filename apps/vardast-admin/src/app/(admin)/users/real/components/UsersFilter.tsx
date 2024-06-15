import Card from "@vardast/component/Card"
import { Button } from "@vardast/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { LucideSearch } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { UseFormReturn } from "react-hook-form"

import { UsersFilterFields } from "@/app/(admin)/users/real/components/Users"

type UsersFilterProps = {
  form: UseFormReturn<UsersFilterFields, any, undefined>
}

export const UsersFilter = ({ form }: UsersFilterProps) => {
  const { t } = useTranslation()

  return (
    <Form {...form}>
      <form noValidate>
        <Card>
          <div className="flex flex-col justify-between gap-6">
            <div className="grid grid-cols-4 gap-6">
              {" "}
              <FormField
                control={form.control}
                name="name"
                render={(_) => (
                  <FormItem>
                    <FormLabel>نام کاربر</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
                        <LucideSearch className="h-6 w-6 text-primary" />
                        <Input
                          autoFocus
                          defaultValue=""
                          onChange={(e) => {
                            form.setValue("name", e.target.value)
                          }}
                          type="text"
                          placeholder={t("common:user")}
                          className="flex h-full w-full
                      items-center
                      gap-2
                      rounded-lg
                      bg-alpha-100
                      px-4
                       focus:!ring-0 disabled:bg-alpha-100"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 gap-6">
              <div className="col-start-4 flex justify-end gap-3">
                <Button
                  className="w-full"
                  variant="secondary"
                  type="reset"
                  // onClick={handleReset}
                >
                  {t("common:remove_filter")}
                </Button>
                <Button className="w-full" variant="primary" type="submit">
                  {t("common:submit_filter")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  )
}
