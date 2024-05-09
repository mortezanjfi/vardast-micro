"use client"

import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import { useQuery } from "@tanstack/react-query"
import {
  GetAllCategoriesQuery,
  IndexCategoryInput,
  InputMaybe
} from "@vardast/graphql/generated"
import { getAllCategoriesQueryFn } from "@vardast/query/queryFns/allCategoriesQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { RequireAtLeastOne } from "@vardast/type/RequireAtLeastOne"
import { LucideCheck } from "lucide-react"

import FilterBlock from "./filter-block"

interface BrandCategoryFilterInterface {
  brandId?: number
  sellerId?: number
  categoryIdsFilter: InputMaybe<number[]> | undefined
  onCategoryIdsFilterChanged: (
    _: { value: InputMaybe<number> } & {
      status: Checkbox.CheckedState
    }
  ) => void
}

type BrandCategoryFilterProps = RequireAtLeastOne<
  BrandCategoryFilterInterface,
  "brandId" | "sellerId"
>

const BrandOrSellerCategoryFilter = ({
  brandId,
  sellerId,
  categoryIdsFilter,
  onCategoryIdsFilterChanged
}: BrandCategoryFilterProps) => {
  const args: IndexCategoryInput = {}
  if (brandId) args["brandId"] = brandId
  if (sellerId) args["sellerId"] = sellerId
  const { data } = useQuery<GetAllCategoriesQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.ALL_CATEGORIES_QUERY_KEY, args],
    queryFn: () => getAllCategoriesQueryFn(args)
  })

  const categories = data ? data.categories : undefined

  return (
    <FilterBlock title="دسته‌بندی" openDefault={true}>
      <div className="flex flex-col gap-3">
        {categories?.data &&
          categories.data.map(
            (category) =>
              category && (
                <Label.Root
                  key={category.id}
                  className="flex items-center gap-2"
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
                      !!categoryIdsFilter &&
                      categoryIdsFilter.some((item) => item === category.id)
                    }
                    onCheckedChange={(checked) =>
                      onCategoryIdsFilterChanged({
                        status: checked,
                        value: category.id
                      })
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
    </FilterBlock>
  )
}

export default BrandOrSellerCategoryFilter
