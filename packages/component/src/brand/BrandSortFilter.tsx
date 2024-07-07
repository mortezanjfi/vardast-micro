"use client"

import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import { IndexCategoryInput, SortBrandEnum } from "@vardast/graphql/generated"
import { LucideCheck } from "lucide-react"

import FilterBlock from "../filter-block"

type BrandCategoryFilterProps = {
  onSortChanged: (_: SortBrandEnum) => void
  sort: SortBrandEnum
}

export const sortBrand = {
  [SortBrandEnum.Newest]: {
    value: SortBrandEnum.Newest,
    name_fa: "جدیدترین"
  },
  [SortBrandEnum.Rating]: {
    value: SortBrandEnum.Rating,
    name_fa: "بالاترین امتیاز"
  },
  [SortBrandEnum.Sum]: {
    value: SortBrandEnum.Sum,
    name_fa: "بیشترین کالا"
  },
  [SortBrandEnum.View]: {
    value: SortBrandEnum.View,
    name_fa: "پربازدیدترین"
  }
}

const BrandOrSellerCategoryFilter = ({
  onSortChanged,
  sort
}: BrandCategoryFilterProps) => {
  const args: IndexCategoryInput = {}
  return (
    <FilterBlock title="مرتب سازی" openDefault={true}>
      <div className="flex flex-col gap-3">
        {Object.entries(sortBrand).map(([key, value]) => (
          <Label.Root key={key} className="flex items-center gap-2">
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

export default BrandOrSellerCategoryFilter
