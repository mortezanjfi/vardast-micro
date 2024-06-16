"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { TypeProject } from "@vardast/graphql/generated"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
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
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }

export type CreateLegalUserInfoType = TypeOf<typeof CreateLegalUserSchema>

const CreateLegalUserSchema = z.object({
  type: z.string(),
  cellPhone: z.string()
})

const AddLegalUserModal = ({ open, setOpen }: Props) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const router = useRouter()

  const form = useForm<CreateLegalUserInfoType>({
    resolver: zodResolver(CreateLegalUserSchema)
  })

  const onCreateProject = (data) => {
    console.log(data)
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex h-full w-full flex-col gap-7">
          <DialogHeader className="h-fit border-b pb-9 pt-4 md:pb md:pt-0">
            <DialogTitle>
              {t("common:add_new_entity", { entity: t("common:user") })}
            </DialogTitle>
          </DialogHeader>

          {errors && (
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
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onCreateProject)}
              className="flex flex-col"
            >
              <div className="grid w-full grid-cols-2 gap-7 ">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع پروژه</FormLabel>
                      <FormControl toggleInputGroup="h-full" className="h-14">
                        <ToggleGroup
                          defaultValue="LEGAL"
                          className="input-field grid grid-cols-2 p-0.5"
                          type="single"
                          value={field.value}
                          onValueChange={(value: TypeProject) => {
                            form.setValue("type", value)
                          }}
                        >
                          <ToggleGroupItem
                            className={clsx(
                              "h-full rounded-xl p-0.5 text-alpha-500",
                              form.watch("type") === TypeProject.Legal &&
                                "!bg-alpha-white !text-alpha-black shadow-lg"
                            )}
                            value={TypeProject.Legal}
                          >
                            حقوقی
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            className={clsx(
                              "h-full rounded-xl p-0.5 text-alpha-500",
                              form.watch("type") === TypeProject.Real &&
                                "!bg-alpha-white !text-alpha-black shadow-lg"
                            )}
                            value={TypeProject.Real}
                          >
                            حقیقی
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cellPhone"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>{t("common:cellphone")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t("common:enter")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" mt-7 flex w-full flex-row-reverse gap border-t pt-6 ">
                <Button type="submit" variant="primary">
                  تایید و ادامه
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default AddLegalUserModal
