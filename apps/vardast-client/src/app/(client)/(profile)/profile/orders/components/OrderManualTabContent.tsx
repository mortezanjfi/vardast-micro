/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import "chart.js/auto"

import { useRouter } from "next/navigation"
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
import { Textarea } from "@vardast/ui/textarea"
import zodI18nMap from "@vardast/util/zodErrorMap"

type OrderManualTabContentProps = {}

const CreateOrderInfoSchema = z.object({
  name: z.string(),
  brandName: z.string(),
  unit: z.string(),
  amount: z.coerce.number(),
  attributes: z.string(),
  description: z.string()
})

export enum PayMethod {
  CASH = "CASH",
  CREDIT = "CREDIT"
}

export type CreateOrderInfoType = TypeOf<typeof CreateOrderInfoSchema>

const OrderManualTabContent = ({}: OrderManualTabContentProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [projectDialog, setProjectDialog] = useState(false)
  const [projectQueryTemp, setProjectQueryTemp] = useState("")

  const [addressDialog, setAddressDialog] = useState(false)
  const [addressQueryTemp, setAddressQueryTemp] = useState("")

  const [expireDialog, setExpireDialog] = useState(false)
  const [expireQueryTemp, setExpireQueryTemp] = useState("")

  const [value, setValue] = useState<PayMethod>(PayMethod.CASH)

  const form = useForm<CreateOrderInfoType>({
    resolver: zodResolver(CreateOrderInfoSchema)
  })
  z.setErrorMap(zodI18nMap)

  const projects = [
    { id: 1, name: "test" },
    { id: 2, name: "test2" }
  ]
  const addresses = [
    { id: 1, name: "test" },
    { id: 2, name: "test2" }
  ]
  const expireTime = ["1 روز", "1 ماه", "1 هفته"]

  const submit = (data: any) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex w-full flex-col gap-5 py-5"
      >
        <div className="grid w-full grid-cols-3 gap-7">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام کالا</FormLabel>
                <FormControl>
                  <Input placeholder="وارد کنید" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>برند</FormLabel>
                <FormControl>
                  <Input placeholder="وارد کنید" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>واحد</FormLabel>
                <FormControl>
                  <Input placeholder="وارد کنید" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-7">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>مقدار کالا (تعداد)</FormLabel>
                <FormControl>
                  <Input placeholder="وارد کنید" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attributes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ویژگی ها (اختیاری)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="مثال: متراژ، ضخامت، طول و ..."
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          {" "}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>توضیحات (اختیاری)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="متن خود را وارد کنید"
                    style={{ resize: "none" }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row-reverse py-5">
          <Button type="submit" variant="primary">
            افزودن کالا به سفارش
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default OrderManualTabContent
