"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import AdminAddOrderProductTabs from "@/app/(admin)/orders/components/AdminAddOrderProductTabs"
import CardContainer from "@/app/(admin)/orders/components/CardContainer"

type AddOrderProductProps = { uuid: string }

function AddOrderProduct({ uuid }: AddOrderProductProps) {
  const [ProductIds, setProductIds] = useState<number[]>([])
  const [expensexId, setExpensesId] = useState<number[]>([])

  const additionalExpenses = [
    { id: 1, name: "انبارداری" },
    { id: 2, name: "بارگیری" },
    { id: 3, name: "باسکول" },
    { id: 4, name: "حمل" },
    { id: 5, name: "تخلیه" }
  ]

  z.setErrorMap(zodI18nMap)
  const OrderSchema = z.object({
    productId: z.array(z.number()),
    expensesIds: z.array(z.number())
  })

  type OrderType = TypeOf<typeof OrderSchema>

  const form = useForm<OrderType>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      expensesIds: expensexId,
      productId: ProductIds
    }
  })

  const submit = (data: any) => {
    console.log(data)
  }
  return (
    <CardContainer title="افزودن کالا به سفارش">
      <div className="flex flex-col ">
        <p className="border-b py-5">
          کالاها و هزینه های جانبی را از یک یا ترکیبی از روش های زیر انتخاب کرده
          و به لیست کالاهای سفارش اضافه کنید
        </p>
        <AdminAddOrderProductTabs />
        <div className="flex flex-col gap-2 border-y py-5">
          <span className=" pb-2 text-lg font-semibold">هزینه های جانبی </span>
          <p className="text-sm">
            هزینه های جانبی سفارش خود را انتخاب کرده و سپس قیمت گذاری کنید.
          </p>
        </div>
        {additionalExpenses.length && (
          <div className=" py-5">
            <Form {...form}>
              <form
                className="flex flex-col gap-5"
                onSubmit={form.handleSubmit(submit)}
              >
                <FormField
                  control={form.control}
                  name="expensesIds"
                  render={() => (
                    <FormItem>
                      {additionalExpenses.map(
                        (item) =>
                          item && (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="expensesIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="checkbox-field"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([
                                              ...field.value,
                                              item.id
                                            ])
                                            setExpensesId((prev) => [
                                              ...prev,
                                              item.id
                                            ])
                                            console.log(expensexId)
                                          } else {
                                            field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                            expensexId.filter(
                                              (value) => value !== item.id
                                            )
                                            console.log(expensexId)
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel>{item.name}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          )
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row-reverse border-t py-5">
                  <Button type="submit" variant="primary">
                    افزودن قیمت
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}{" "}
      </div>
    </CardContainer>
  )
}

export default AddOrderProduct
