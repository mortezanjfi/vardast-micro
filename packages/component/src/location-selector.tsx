"use client"

import { useState } from "react"
import {
  City,
  Province,
  useGetCountryWithCitiesQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import { Dialog, DialogContent, DialogTrigger } from "@vardast/ui/dialog"
import { Input } from "@vardast/ui/input"
import { Label } from "@vardast/ui/label"
import {
  LucideArrowRight,
  LucideChevronLeft,
  LucideLoader2,
  LucideMapPin,
  LucideX,
  Search
} from "lucide-react"

const LocationSelector = () => {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  )
  const [selectedCities, setSelectedCities] = useState<City[] | []>([])
  const countryQuery = useGetCountryWithCitiesQuery(
    graphqlRequestClientWithToken,
    {
      slug: "iran-islamic-republic-of"
    },
    {
      enabled: false
    }
  )

  const loadCountry = () => {
    countryQuery.refetch()
  }

  interface ProvinceListProps {
    provinces: Province[]
  }

  const ProvinceList = ({ provinces }: ProvinceListProps) => {
    return (
      <div className="flex w-full flex-col divide-y divide-alpha-200">
        {provinces.map(
          (province) =>
            province && (
              <>
                <Button
                  className="flex items-center justify-between py-3"
                  key={province.id}
                  noStyle
                  onClick={() => setSelectedProvince(province)}
                >
                  <span>{province.name}</span>
                  <LucideChevronLeft className="h-4 w-4 text-alpha-500" />
                </Button>
              </>
            )
        )}
      </div>
    )
  }

  interface CitiesListProps {
    province: Province
  }

  const CitiesList = ({ province }: CitiesListProps) => {
    return (
      <div className="flex flex-col items-start">
        <Button variant="ghost" onClick={() => setSelectedProvince(null)}>
          <LucideArrowRight className="icon" />
          <span>همه شهرها</span>
        </Button>
        <div className="flex w-full flex-col space-y-3 divide-y divide-alpha-200">
          <Label className="flex w-full items-center gap-1.5 pt-3">
            <Checkbox />
            همه شهرهای {province.name}
          </Label>
          {province.cities.map(
            (city) =>
              city && (
                <Label
                  className="flex w-full items-center gap-1.5 pt-3"
                  key={city?.id}
                >
                  <Checkbox
                    checked={
                      selectedCities.find((item) => item.id === city.id)
                        ? true
                        : false
                    }
                    onCheckedChange={(checked) => {
                      checked
                        ? setSelectedCities([...selectedCities, city])
                        : setSelectedCities((values) => {
                            return values.filter((item) => item.id !== city.id)
                          })
                    }}
                  />
                  {city?.name}
                </Label>
              )
          )}
        </div>
      </div>
    )
  }

  return (
    <Dialog onOpenChange={() => loadCountry()}>
      <DialogTrigger asChild>
        <Button size="small" variant="secondary">
          <LucideMapPin className="icon" />
          <span>انتخاب شهر</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="sticky -top-6 -mx-6 -mt-6 border-b border-alpha-200 bg-white p-6">
          <h2 className="dialog-title">انتخاب شهر</h2>
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {selectedCities &&
                selectedCities.map((city) => (
                  <div
                    className="flex items-center gap-1 rounded border border-alpha-200 px-2 py-1 pl-1 text-sm"
                    key={city.id}
                  >
                    {city.name}
                    <Button
                      iconOnly
                      size="xsmall"
                      variant="ghost"
                      onClick={() => {
                        setSelectedCities((values) => {
                          return values.filter((item) => item.id !== city.id)
                        })
                      }}
                    >
                      <LucideX className="icon" />
                    </Button>
                  </div>
                ))}
            </div>
            <div className="form-control form-control-sm">
              <div className="input-group">
                <div className="input-inset">
                  <div className="input-element">
                    <Search />
                  </div>
                  <Input placeholder="جستجو در شهرها..." />
                </div>
              </div>
            </div>
          </div>
        </div>
        {countryQuery.isLoading && (
          <div className="flex items-center justify-center p-12">
            <LucideLoader2 className="animate-spin text-alpha-400" />
          </div>
        )}
        {countryQuery.data &&
          countryQuery.data.country &&
          countryQuery.data.country.provinces &&
          (selectedProvince ? (
            <CitiesList province={selectedProvince} />
          ) : (
            <ProvinceList
              provinces={countryQuery.data.country.provinces as Province[]}
            />
          ))}
      </DialogContent>
    </Dialog>
  )
}

export default LocationSelector
