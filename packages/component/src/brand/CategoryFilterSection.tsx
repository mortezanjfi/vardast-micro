"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedState } from "@mantine/hooks"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import { LucideCheck } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { useGetAllCategoriesV2Query } from "../../../graphql/src/generated"
import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"
import { Input } from "../../../ui/src/input"
import FilterBlock from "../filter-block"

type CategoryFilterSectionProps = {
  setSelectedCategoryIds: Dispatch<SetStateAction<number[]>>
  selectedCategoryIds: number[]
}

const CategoryFilterSection = ({
  setSelectedCategoryIds,
  selectedCategoryIds
}: CategoryFilterSectionProps) => {
  const { t } = useTranslation()
  const [categoryQuery, setCategoryQuery] = useDebouncedState("", 500)
  const [categoryQueryTemp, setCategoryQueryTemp] = useState("")
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { push } = useRouter()

  const categories = useGetAllCategoriesV2Query(graphqlRequestClientWithToken, {
    indexCategoryInput: {
      name: categoryQuery
    }
  })

  const handleCheckboxChange = (categoryId: number) => {
    setSelectedCategoryIds((prev) => {
      const isCategorySelected = prev.includes(categoryId)
      if (isCategorySelected) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  return (
    <FilterBlock title="دسته‌بندی" openDefault={true}>
      <div className=" flex w-full flex-col gap-4">
        <Input
          autoFocus
          value={categoryQueryTemp}
          onChange={(e) => {
            setCategoryQueryTemp(e.target.value)
            setCategoryQuery(e.target.value)
          }}
          type="text"
          placeholder="دسته بندی"
          className=" flex w-full
                      items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                          py-3.5
                           focus:!ring-0 disabled:bg-alpha-100"
        />
        <div className="hide-scrollbar flex max-h-72 flex-col overflow-y-auto">
          {categories?.data?.allCategoriesV2?.map(
            (category, index) =>
              category && (
                <Label.Root
                  key={category.id}
                  className="flex items-center gap-2 border-b border-x-alpha-200 py-4"
                >
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
                    checked={
                      category.id ===
                      selectedCategoryIds.find((id) => id === category.id)
                    }
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(category.id)
                    }
                  >
                    <Checkbox.Indicator className="text-white">
                      <LucideCheck className="h-3 w-3" strokeWidth={3} />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="inline-block leading-none">
                    {category.title}
                  </span>
                </Label.Root>
              )
          )}
        </div>
      </div>

      {/* <div className="flex flex-col gap-3">
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
            >
              <Checkbox.Indicator className="text-white">
                <LucideCheck className="h-3 w-3" strokeWidth={3} />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="inline-block leading-none">{value.name_fa}</span>
          </Label.Root>
        ))}
      </div> */}
    </FilterBlock>
  )
}

export default CategoryFilterSection
