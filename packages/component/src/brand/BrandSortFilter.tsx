"use client"

import { Dispatch, SetStateAction } from "react"
import { ReadonlyURLSearchParams, useRouter } from "next/navigation"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import { LucideCheck } from "lucide-react"

import { SortBrandEnum } from "../../../graphql/src/generated"

type BrandCategoryFilterProps = {
  setSort: Dispatch<SetStateAction<SortBrandEnum>>
  sort: SortBrandEnum
  searchParams: ReadonlyURLSearchParams
  pathname: string
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
  setSort,
  sort,
  pathname,
  searchParams
}: BrandCategoryFilterProps) => {
  const { push } = useRouter()

  const onSortChanged = (sort: SortBrandEnum) => {
    setSort((prev) => {
      const isSortSelected = prev === sort
      const params = new URLSearchParams(searchParams as any)
      if (isSortSelected) {
        params.delete("orderBy")
      } else {
        params.set("orderBy", `${sort}`)
      }
      push(pathname + "?" + params.toString())
      return isSortSelected ? undefined : sort
    })
  }
  return (
    <div className="flex flex-col">
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
    </div>
  )
}

export default BrandOrSellerCategoryFilter
