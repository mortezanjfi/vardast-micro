import { Dispatch, SetStateAction, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@vardast/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { Colleague } from "@/app/(client)/(profile)/profile/projects/components/ProjectColleaguesTab"

type ColleagueModalProps = {
  open: boolean
  activeTab: string
  onOpenChange: Dispatch<SetStateAction<boolean>>
  setColleagues: Dispatch<SetStateAction<Colleague[]>>
}
export const ModalSchema = z.object({
  name: z.string(),
  familyName: z.string(),
  cellPhone: z.coerce.number()
})

export type CatalogModalType = TypeOf<typeof ModalSchema>

export const ColleagueModal = ({
  onOpenChange,
  open,
  setColleagues
}: ColleagueModalProps) => {
  const { t } = useTranslation()

  const form = useForm<CatalogModalType>({
    resolver: zodResolver(ModalSchema),
    defaultValues: {}
  })

  //upload catalog file

  const submit = (data: any) => {
    console.log(data)
    data.id = new Date().getTime()
    setColleagues((prev) => [...prev, data])
    onOpenChange(false)
  }

  useEffect(() => {
    form.reset()
  }, [form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-7">
        <DialogHeader className="border-b pb">
          <DialogTitle>
            {" "}
            {t("common:add_new_entity", { entity: t("common:colleague") })}
          </DialogTitle>
        </DialogHeader>
        {/* {errors && (
            <Alert variant="danger">
              <LucideAlertOctagon />
              <AlertTitle>خطا</AlertTitle>
              <AlertDescription>
                {(
                  errors.response.errors?.at(0)?.extensions
                    .displayErrors as string[]
                ).map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </AlertDescription>
            </Alert>
          )} */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <div className="grid w-full grid-cols-2 grid-rows-2 gap-y-5">
              <div className="col-span-2 grid grid-cols-2 gap-x-7">
                <div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نام </FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="familyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نام خانوادگی </FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-x-7">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="cellPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:cellPhone")}</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-7 border-t pt">
              <div className="flex items-center gap-2">
                <Button
                  className="py-2"
                  variant="ghost"
                  onClick={() => {
                    onOpenChange(false)
                  }}
                >
                  انصراف
                </Button>
                <Button className="py-2" variant="primary" type="submit">
                  ذخیره آدرس
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
