/* eslint-disable no-unused-vars */
"use client"

import "chart.js/auto"

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

const OrderManualTabContent = ({ addProductLine, form }: any) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(addProductLine)}
        className="flex w-full flex-col gap-5 py-5"
      >
        <div className="grid w-full grid-cols-3 gap-7">
          <FormField
            control={form.control}
            name="item_name"
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
            name="brand"
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
            name="uom"
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
            name="qty"
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
            name="attribuite"
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
          <FormField
            control={form.control}
            name="descriptions"
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
          <Button
            disabled={
              form.formState.isLoading ||
              form.formState.isSubmitting ||
              !form.watch("item_name") ||
              !form.watch("brand") ||
              !form.watch("uom")
            }
            loading={form.formState.isLoading || form.formState.isSubmitting}
            type="submit"
            variant="primary"
          >
            افزودن کالا به سفارش
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default OrderManualTabContent
