"use client"

import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import {
  FilterAttribute,
  useGetAllFilterableAttributesQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithoutToken from "@vardast/query/queryClients/graphqlRequestClientWithoutToken"
import { RequireAtLeastOne } from "@vardast/type/RequireAtLeastOne"
import { LucideCheck } from "lucide-react"

import FilterBlock from "./filter-block"

interface FiltersContainerInterface {
  selectedCategoryId?: number
  brandId?: number
  sellerId?: number
  filterAttributes: FilterAttribute[]
  onFilterAttributesChanged: (
    _: FilterAttribute & { status: boolean | "indeterminate" }
  ) => void
}

type FiltersContainerProps = RequireAtLeastOne<
  FiltersContainerInterface,
  "selectedCategoryId" | "brandId" | "sellerId"
>

const FiltersContainer = ({
  selectedCategoryId,
  onFilterAttributesChanged,
  filterAttributes
}: FiltersContainerProps) => {
  const getAllFilterableAttributesQuery = useGetAllFilterableAttributesQuery(
    graphqlRequestClientWithoutToken,
    {
      filterableAttributesInput: {
        categoryId: selectedCategoryId || 0
      }
    },
    {
      enabled: !!selectedCategoryId
    }
  )

  return (
    <>
      {getAllFilterableAttributesQuery.fetchStatus === "fetching" &&
        getAllFilterableAttributesQuery.status === "loading" && (
          <div className="flex animate-pulse flex-col gap-3 py-6">
            <div className="h-5 w-[80%] rounded-md bg-alpha-200"></div>
            <div className="h-5 w-full rounded-md bg-alpha-200"></div>
            <div className="h-5 w-[90%] rounded-md bg-alpha-200"></div>
          </div>
        )}
      <FilterBlock title="ویژگی ها">
        {getAllFilterableAttributesQuery.data &&
          getAllFilterableAttributesQuery.data.filterableAttributes.filters.map(
            (filter) =>
              filter && (
                <FilterBlock
                  key={filter.id}
                  title={filter.name}
                  openDefault={filterAttributes.some(
                    (item) => item.id === filter.id
                  )}
                >
                  <div className="flex flex-col">
                    {filter.values?.options?.map(
                      (value: string, idx: number) =>
                        value && (
                          <Label.Root
                            key={idx}
                            className="flex items-center gap-2 border-b-2 border-alpha-200 py-3"
                          >
                            <Checkbox.Root
                              className="flex
                        h-5
                        w-5
                        appearance-none
                        items-center
                        justify-center
                        rounded-md
                        bg-alpha-200
                        outline-none
                        data-[state='checked']:border-primary-500
                        data-[state='checked']:bg-primary-500"
                              checked={filterAttributes.some(
                                (item) =>
                                  item.id === filter.id && item.value === value
                              )}
                              onCheckedChange={(checked) =>
                                onFilterAttributesChanged({
                                  status: checked,
                                  id: filter.id,
                                  value: value
                                })
                              }
                            >
                              <Checkbox.Indicator className="text-white">
                                <LucideCheck
                                  className="h-3 w-3"
                                  strokeWidth={3}
                                />
                              </Checkbox.Indicator>
                            </Checkbox.Root>
                            <span className="inline-block leading-none">
                              {value}
                            </span>
                          </Label.Root>
                        )
                    )}
                  </div>
                </FilterBlock>
              )
          )}
      </FilterBlock>
    </>
  )
}

export default FiltersContainer
