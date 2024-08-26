import { useState } from "react"
import { Button } from "@vardast/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import clsx from "clsx"
import { LucideSearch, LucideX } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import Link from "../Link"

type ProductsFilterProps = {
  isAdmin?: boolean
  isMyProductsPage: boolean
  form: UseFormReturn<any, undefined>
}

export const ProductsFilter = ({
  isAdmin,
  form,
  isMyProductsPage
}: ProductsFilterProps) => {
  const [queryTemp, setQueryTemp] = useState<string>("")

  const formSubmit = () => {
    form.setValue("query", queryTemp)
  }

  return (
    <div
      className={clsx(
        "flex flex-col gap-7 py-5 md:px-5",
        !isAdmin && "card rounded "
      )}
    >
      {!isMyProductsPage && !isAdmin ? (
        <div className="flex justify-between">
          <div>
            <p>
              کالای که قصد فروش آن را دارید را جستجو کنید، در صورت موجود نبودن
              کالا، اقدام به درج کالا کنید
            </p>
          </div>
          <div className="flex gap-5">
            <p>کالای شما در میان نتایج وجود ندارد؟</p>
            <Link className="text-blue-600 underline" href={"/products/new"}>
              افزودن کالا
            </Link>
          </div>
        </div>
      ) : (
        ""
      )}

      <Form {...form}>
        <form
          className="flex w-full items-end justify-between gap-7"
          noValidate
          onSubmit={form.handleSubmit(formSubmit)}
        >
          <div className="w-full">
            <FormField
              control={form.control}
              name="query"
              render={(_) => (
                <FormItem>
                  <FormLabel>جستجو در کالاها</FormLabel>
                  <FormControl>
                    <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
                      <LucideSearch className="h-6 w-6 text-primary" />
                      <Input
                        autoFocus
                        className="flex h-full w-full
                    items-center
                    gap-2
                    rounded-lg
                    bg-alpha-100
                    px-4
                    py-3 focus:!ring-0 disabled:bg-alpha-100"
                        placeholder="نام کالا"
                        type="text"
                        value={queryTemp}
                        onChange={(e) => {
                          setQueryTemp(e.target.value)
                          console.log(e.target.value)
                        }}
                      />
                      <Button
                        className="rounded-full"
                        iconOnly
                        size="small"
                        variant="ghost"
                        onClick={() => {
                          setQueryTemp("")
                        }}
                      >
                        <LucideX className="icon" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button className="h-[40px]" size="large" type="submit">
            جستجو
          </Button>
        </form>
      </Form>
    </div>
  )
}
