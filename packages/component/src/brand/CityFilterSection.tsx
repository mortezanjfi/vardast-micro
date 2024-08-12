"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import { LucideCheck } from "lucide-react"

import { useGetAllCitiesQuery } from "../../../graphql/src/generated"
import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"
import { Input } from "../../../ui/src/input"
import FilterBlock from "../filter-block"

type CityFilterSectionProps = {
  setSelectedCityId: Dispatch<SetStateAction<number>>
  selectedCityId: number
}

const CityFilterSection = ({
  setSelectedCityId,
  selectedCityId
}: CityFilterSectionProps) => {
  const [cityQuery, setCityQuery] = useDebouncedState("", 500)
  const [cityQueryTemp, setCityQueryTemp] = useState("")

  const cities = useGetAllCitiesQuery(graphqlRequestClientWithToken, {
    indexCityInput: { name: cityQuery }
  })

  const handleCheckboxChange = (cityId: number) => {
    setSelectedCityId((prev) => {
      const isCategorySelected = prev === cityId
      if (isCategorySelected) {
        return null
      } else {
        return cityId
      }
    })
  }

  return (
    <FilterBlock
      badgeNumber={selectedCityId ? 1 : null}
      title="شهر"
      openDefault={true}
    >
      <div className=" flex w-full flex-col gap-4">
        <Input
          autoFocus
          value={cityQueryTemp}
          onChange={(e) => {
            setCityQueryTemp(e.target.value)
            setCityQuery(e.target.value)
          }}
          type="text"
          placeholder="شهر"
          className=" flex w-full
                      items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                         
                           focus:!ring-0 disabled:bg-alpha-100"
        />
        <div className=" flex max-h-44 flex-col overflow-y-auto">
          {cities?.data?.cities?.data?.map(
            (city) =>
              city && (
                <Label.Root
                  key={city.id}
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
                      city.id === selectedCityId
                      // selectedCityId.find((id) => id === category.id)
                    }
                    onCheckedChange={
                      () => handleCheckboxChange(city.id)
                      // setSelectedCityId(city.id)
                    }
                  >
                    <Checkbox.Indicator className="text-white">
                      <LucideCheck className="h-3 w-3" strokeWidth={3} />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="inline-block leading-none">{city.name}</span>
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

export default CityFilterSection
