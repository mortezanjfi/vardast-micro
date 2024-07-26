"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import Card from "@vardast/component/Card"
import {
  useGetAllCategoriesQuery,
  useGetProvinceQuery
} from "@vardast/graphql/generated"
import { statusesOfAvailability } from "@vardast/lib/AvailabilityStatus"
import { brandSorts } from "@vardast/lib/BrandSort"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Button } from "@vardast/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@vardast/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import { LucideCheck, LucideChevronsUpDown, LucideSearch } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { UseFormReturn } from "react-hook-form"

import { FilterFields } from "@/app/(admin)/brands/components/Brands"

type BrandsFilterProps = {
  form: UseFormReturn<FilterFields, any, undefined>
  setBrandsQueryParams: Dispatch<SetStateAction<FilterFields>>
}

export const BrandFilter = ({
  form,
  setBrandsQueryParams
}: BrandsFilterProps) => {
  const [query, setQuery] = useDebouncedState<string>("", 500)
  const [queryTemp, setQueryTemp] = useState<string>("")
  const [sortDialog, setSortDialog] = useState<boolean>(false)
  const [logoDialog, setLogoDialog] = useState<boolean>(false)
  const [catalogDialog, setCatalogDialog] = useState<boolean>(false)
  const [priceListDialog, setPriceListDialog] = useState<boolean>(false)
  const [cityDialog, setCityDialog] = useState(false)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [categoryQueryTemp, setCategoryQueryTemp] = useState("")

  const { t } = useTranslation()

  const cities = useGetProvinceQuery(graphqlRequestClientWithToken)

  const rootCategories = useGetAllCategoriesQuery(
    graphqlRequestClientWithToken,
    {
      indexCategoryInput: {
        onlyRoots: true
      }
    }
  )

  useEffect(() => {
    form.setValue("brand", query)
  }, [form, query])
  const handleSubmit = () => {
    setBrandsQueryParams({
      brand: form.getValues("brand"),
      logoStatus: form.getValues("logoStatus"),
      catalogStatus: form.getValues("catalogStatus"),
      priceListStatus: form.getValues("priceListStatus"),
      bannerStatus: form.getValues("bannerStatus"),
      sort: form.getValues("sort"),
      cityId: form.getValues("cityId"),
      categoryId: form.getValues("categoryId")
    })
  }
  const handleReset = () => {
    form.reset()
    setQuery("")
    setQueryTemp("")
    setBrandsQueryParams({})
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <div className="flex flex-col justify-between gap-6">
            <div className="grid grid-cols-4 grid-rows-3 gap-6">
              <FormField
                control={form.control}
                name="brand"
                render={(_) => (
                  <FormItem>
                    <FormLabel>{t("common:brand")}</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 py-0.5 pr-2 transition-all">
                        <LucideSearch className="h-6 w-6 text-primary" />

                        <Input
                          autoFocus
                          value={queryTemp}
                          onChange={(e) => {
                            setQueryTemp(e.target.value)
                            setQuery(e.target.value)
                          }}
                          type="text"
                          placeholder="نام برند"
                          className="flex h-full w-full items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                          py-3.5
                           focus:!ring-0 disabled:bg-alpha-100"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:logo")}</FormLabel>
                    <Popover open={logoDialog} onOpenChange={setLogoDialog}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {
                              statusesOfAvailability.find(
                                (st) => st.value === field.value
                              )?.status
                            }
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {statusesOfAvailability.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("logoStatus", value)
                                  setLogoDialog(false)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    st.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {st.status}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="catalogStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:catalog")}</FormLabel>
                    <Popover
                      open={catalogDialog}
                      onOpenChange={setCatalogDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {
                              statusesOfAvailability.find(
                                (st) => st.value === field.value
                              )?.status
                            }
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          {/* <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty> */}
                          <CommandGroup>
                            {statusesOfAvailability.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("catalogStatus", value)
                                  setCatalogDialog(false)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    st.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {st.status}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priceListStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:price_list")}</FormLabel>
                    <Popover
                      open={priceListDialog}
                      onOpenChange={setPriceListDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {
                              statusesOfAvailability.find(
                                (st) => st.value === field.value
                              )?.status
                            }

                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          {/* <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty> */}
                          <CommandGroup>
                            {statusesOfAvailability.map((st) => (
                              <CommandItem
                                defaultValue="ili"
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("priceListStatus", value)
                                  setPriceListDialog(false)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    st.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {st.status}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:banner")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {
                              statusesOfAvailability.find(
                                (st) => st.value === field.value
                              )?.status
                            }

                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          {/* <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty> */}
                          <CommandGroup>
                            {statusesOfAvailability.map((st) => (
                              <CommandItem
                                defaultValue="ili"
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("bannerStatus", value)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    st.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {st.status}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:sorting")}</FormLabel>
                    <Popover open={sortDialog} onOpenChange={setSortDialog}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? brandSorts.find(
                                  (st) => st.value === field.value
                                )?.status
                              : t("common:select_placeholder")}

                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          {/* <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty> */}
                          <CommandGroup>
                            {brandSorts.map((sort) => (
                              <CommandItem
                                value={sort.value}
                                key={sort.value}
                                onSelect={(value) => {
                                  form.setValue("sort", value.toUpperCase())
                                  setSortDialog(false)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    sort.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {sort.status}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:city")}</FormLabel>
                    <Popover open={cityDialog} onOpenChange={setCityDialog}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={
                              cities.isFetching ||
                              cities.isLoading ||
                              !cities.data?.province.cities.length
                            }
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? cities?.data?.province.cities.find(
                                  (city) => city && city.id === field.value
                                )?.name
                              : t("common:choose_entity", {
                                  entity: t("common:city")
                                })}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput
                            placeholder={t("common:search_entity", {
                              entity: t("common:city")
                            })}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:city")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {cities.data?.province.cities.map(
                              (city) =>
                                city && (
                                  <CommandItem
                                    value={city.name}
                                    key={city.id}
                                    onSelect={(value) => {
                                      const selected =
                                        cities.data?.province.cities.find(
                                          (item) => item?.name === value
                                        )
                                      form.setValue("cityId", selected?.id || 0)
                                      setCityDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        city.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {city.name}
                                  </CommandItem>
                                )
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:category")}</FormLabel>
                    <Popover
                      open={categoryDialog}
                      onOpenChange={setCategoryDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={
                              rootCategories?.data?.categories?.data?.length ===
                              0
                            }
                            noStyle
                            role="combobox"
                            className="input-field flex items-center"
                          >
                            <span className="inline-block max-w-full truncate">
                              {field.value
                                ? rootCategories?.data?.categories?.data?.find(
                                    (category) =>
                                      category && category.id === +field.value
                                  )?.title
                                : t("common:choose_entity", {
                                    entity: t("common:category")
                                  })}
                            </span>
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="!z-[9999]" asChild>
                        <Command>
                          <CommandInput
                            loading={
                              rootCategories?.data?.categories?.data?.length ===
                              0
                            }
                            value={categoryQueryTemp}
                            onValueChange={(newQuery) => {
                              // setProvinceQuery(newQuery)
                              setCategoryQueryTemp(newQuery)
                            }}
                            placeholder={t("common:search_entity", {
                              entity: t("common:category")
                            })}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:category")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {rootCategories?.data?.categories?.data?.map(
                              (category) =>
                                category && (
                                  <CommandItem
                                    value={`${category?.id}`}
                                    key={category?.id}
                                    onSelect={(value) => {
                                      form.setValue(
                                        "categoryId",
                                        rootCategories?.data?.categories?.data?.find(
                                          (category) =>
                                            category?.id &&
                                            category?.id === +value
                                        )?.id || 0
                                      )
                                      setCategoryDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        category.id === +field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {category?.title}
                                  </CommandItem>
                                )
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-start-4 row-start-3 flex justify-end gap-3">
                <Button
                  className="h-fit w-full"
                  variant="secondary"
                  type="reset"
                  onClick={handleReset}
                >
                  {t("common:remove_filter")}
                </Button>
                <Button
                  className="h-fit w-full"
                  variant="primary"
                  type="submit"
                >
                  {t("common:submit_filter")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  )
}
