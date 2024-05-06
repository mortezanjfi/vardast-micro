import { useState } from "react"
import Card from "@vardast/component/Card"
import Link from "@vardast/component/Link"
import { Button } from "@vardast/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { LucideSearch, LucideX } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { ProductNameSearchFilter } from "@/app/(seller)/products/components/SellerDesktopProductsPage"

type ProductsFilterProps = {
  isMyProductsPage: boolean
  form: UseFormReturn<ProductNameSearchFilter, any, undefined>
}

export const ProductsFilter = ({
  form,
  isMyProductsPage
}: ProductsFilterProps) => {
  const [queryTemp, setQueryTemp] = useState<string>("")

  const formSubmit = () => {
    form.setValue("query", queryTemp)
  }

  return (
    <Card>
      <div className="flex flex-col gap-7">
        {!isMyProductsPage ? (
          <div className="flex justify-between">
            <div>
              <p>
                کالای که قصد فروش آن را دارید را جستجو کنید، در صورت موجود نبودن
                کالا، اقدام به درج کالا کنید
              </p>
            </div>
            <div className="flex gap-5">
              <p>کالای شما در میان نتایج وجود ندارد؟</p>
              <Link
                className="text-blue-600 underline"
                href={"/seller-panel/products/new"}
              >
                افزودن کالا
              </Link>
            </div>
          </div>
        ) : (
          ""
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(formSubmit)}
            noValidate
            className="flex w-full items-end justify-between gap-7"
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
                          value={queryTemp}
                          onChange={(e) => {
                            setQueryTemp(e.target.value)
                            console.log(e.target.value)
                          }}
                          type="text"
                          placeholder="نام کالا"
                          className="flex h-full w-full
                    items-center
                    gap-2
                    rounded-lg
                    bg-alpha-100
                    px-4
                    py-3 focus:!ring-0 disabled:bg-alpha-100"
                        />
                        <Button
                          variant="ghost"
                          size="small"
                          iconOnly
                          className="rounded-full"
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
            <Button type="submit" size="large" className="h-[40px]">
              جستجو
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  )
}
