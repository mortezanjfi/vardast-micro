"use client"

import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import { LucideCheck } from "lucide-react"

import FilterBlock from "../filter-block"

export enum CategoriesSortStatic {
  Newest = "NEWEST",
  Rating = "RATING",
  Sum = "SUM"
}

type CategoriesSortProps = {
  bgColor?: string
  sort: CategoriesSortStatic
  onSortChanged: (_: CategoriesSortStatic) => void
}
export const sortBrand = {
  [CategoriesSortStatic.Newest]: {
    value: CategoriesSortStatic.Newest,
    name_fa: "جدیدترین"
  },
  [CategoriesSortStatic.Rating]: {
    value: CategoriesSortStatic.Rating,
    name_fa: "بالاترین امتیاز"
  },
  [CategoriesSortStatic.Sum]: {
    value: CategoriesSortStatic.Sum,
    name_fa: "بیشترین کالا"
  }
}
const CategoriesSort = ({ sort, onSortChanged }: CategoriesSortProps) => {
  return (
    <FilterBlock title="مرتب سازی" openDefault={true}>
      <div className="flex flex-col divide-y divide-alpha-300">
        {Object.entries(sortBrand).map(([key, value]) => (
          <Label.Root key={key} className="flex items-center gap-2  py-4">
            <Checkbox.Root
              checked={sort === value.value}
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

export default CategoriesSort
