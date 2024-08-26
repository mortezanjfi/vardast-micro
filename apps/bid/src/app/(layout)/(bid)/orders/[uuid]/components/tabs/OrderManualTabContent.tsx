 
"use client"

import "chart.js/auto"

import { OrderProductTabContentProps } from "@vardast/type/OrderProductTabs"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { Textarea } from "@vardast/ui/textarea"

const OrderManualTabContent = ({ form }: OrderProductTabContentProps) => {
  return (
    <>
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
      <FormField
        control={form.control}
        name="descriptions"
        render={({ field }) => (
          <FormItem className="col-span-full">
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
    </>
  )
}

export default OrderManualTabContent
