"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import { useGetAllBrandsQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Input } from "@vardast/ui/input"
import { LucideCheck } from "lucide-react"

import FilterBlock from "../filter-block"

type BrandsFilterSectionProps = {
  setSelectedBrand: Dispatch<SetStateAction<number>>
  selectedBrand: number
}

const BrandsFilterSection = ({
  setSelectedBrand,
  selectedBrand
}: BrandsFilterSectionProps) => {
  const [brandQuery, setBrandQuery] = useDebouncedState("", 500)
  const [brandQueryTemp, setBrandQueryTemp] = useState("")

  const brands = useGetAllBrandsQuery(graphqlRequestClientWithToken, {
    indexBrandInput: { name: brandQuery }
  })

  const handleCheckboxChange = (brandId: number) => {
    setSelectedBrand((prev) => {
      const isCategorySelected = prev === brandId
      if (isCategorySelected) {
        return null
      } else {
        return brandId
      }
    })
  }

  return (
    <FilterBlock
      badgeNumber={selectedBrand ? 1 : null}
      openDefault={true}
      title="برند"
    >
      <div className=" flex w-full flex-col gap-4">
        <Input
          autoFocus
          className=" flex w-full
                      items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                         
                           focus:!ring-0 disabled:bg-alpha-100"
          placeholder="برند"
          type="text"
          value={brandQueryTemp}
          onChange={(e) => {
            setBrandQueryTemp(e.target.value)
            setBrandQuery(e.target.value)
          }}
        />
        <div className=" flex max-h-44 flex-col overflow-y-auto">
          {brands?.data?.brands?.data?.map(
            (brand) =>
              brand && (
                <Label.Root
                  className="flex items-center gap-2 border-b border-x-alpha-200 py-4"
                  key={brand.id}
                >
                  <Checkbox.Root
                    checked={
                      brand.id === selectedBrand
                      // selectedBrand.find((id) => id === category.id)
                    }
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
                    onCheckedChange={
                      () => handleCheckboxChange(brand.id)
                      // setselectedBrand(brand.id)
                    }
                  >
                    <Checkbox.Indicator className="text-white">
                      <LucideCheck className="h-3 w-3" strokeWidth={3} />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="inline-block leading-none">
                    {brand.name}
                  </span>
                </Label.Root>
              )
          )}
        </div>
      </div>
    </FilterBlock>
  )
}

export default BrandsFilterSection
