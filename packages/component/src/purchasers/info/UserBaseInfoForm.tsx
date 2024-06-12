"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@vardast/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import zodI18nMap from "@vardast/util/zodErrorMap"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import CardContainer from "../../desktop/CardContainer"
import Link from "../../Link"

type Props = { uuid: string }

export type CreateLegalUserInfoType = TypeOf<typeof CreateLegalUserSchema>

const CreateLegalUserSchema = z.object({
  companyName: z.string(),
  companyID: z.coerce.number()
})

export default ({ uuid }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const form = useForm<CreateLegalUserInfoType>({
    resolver: zodResolver(CreateLegalUserSchema)
  })

  const submit = (data) => {
    console.log(data)

    router.push(`/users/purchasers/2/info`)
  }
  z.setErrorMap(zodI18nMap)
  return (
    <>
      <Form {...form}>
        <form className="flex flex-col" onSubmit={form.handleSubmit(submit)}>
          <CardContainer
            titleClass="!border-0 font-normal"
            title="اطلاعات خواسته شده را وارد نمایید"
          >
            <div className="grid w-full grid-cols-3 gap-7 ">
              {" "}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>
                      {t("common:entity_name", { entity: t("common:company") })}
                    </FormLabel>
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
              <FormField
                control={form.control}
                name="companyID"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>
                      {t("common:entity_uuid", {
                        entity: t("common:national")
                      })}
                    </FormLabel>
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
            </div>{" "}
          </CardContainer>
          <div className=" mt-7 flex w-full flex-row-reverse gap border-t pt-6 ">
            <Button type="submit" variant="primary">
              تایید و ادامه
            </Button>
            <Link
              className="btn btn-md btn-secondary"
              href={"/users/purchasers"}
            >
              بازگشت به کاربران
            </Link>
          </div>
        </form>
      </Form>
    </>
  )
}
