"use client"

import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import { ProductSortablesEnum } from "@vardast/graphql/generated"
import { LucideCheck } from "lucide-react"

import FilterBlock from "./filter-block"

interface ProductSortProps {
  sort: ProductSortablesEnum
  onSortChanged: (_: ProductSortablesEnum) => void
}
export const sortProducts = {
  [ProductSortablesEnum.Newest]: {
    value: ProductSortablesEnum.Newest,
    name_fa: "جدیدترین"
  },
  [ProductSortablesEnum.MostAffordable]: {
    value: ProductSortablesEnum.MostAffordable,
    name_fa: "ارزانترین"
  },
  [ProductSortablesEnum.MostExpensive]: {
    value: ProductSortablesEnum.MostExpensive,
    name_fa: "گرانترین"
  }
}
const ProductSort = ({ sort, onSortChanged }: ProductSortProps) => {
  return (
    <FilterBlock title="مرتب سازی" openDefault={true}>
      <div className="flex flex-col divide-y divide-alpha-300">
        {Object.entries(sortProducts).map(([key, value]) => (
          <Label.Root key={key} className="flex items-center gap-2  py-4">
            <Checkbox.Root
              className="flex
               h-5
               w-5
               appearance-none
               items-center
               justify-center
               rounded-md
               border-2
               border-alpha-200
               bg-alpha-white
               outline-none
               data-[state='checked']:border-primary-500
               data-[state='checked']:bg-primary-500"
              checked={sort === value.value}
              onCheckedChange={() => {
                onSortChanged(value.value)
              }}
            >
              <Checkbox.Indicator className="text-white">
                <LucideCheck className="h-3 w-3" strokeWidth={3} />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="inline-block leading-none">{value.name_fa}</span>
          </Label.Root>
        ))}
      </div>
    </FilterBlock>
  )
}

export default ProductSort
