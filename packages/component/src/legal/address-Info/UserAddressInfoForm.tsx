"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useGetAllProvincesQuery,
  useGetProvinceQuery
} from "@vardast/graphql/generated"
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
import zodI18nMap from "@vardast/util/zodErrorMap"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import CardContainer from "../../desktop/CardContainer"
import Link from "../../Link"

type Props = { readOnlyMode?: boolean; uuid: string }

const LegalAddresSchema = z.object({
  phone: z.coerce.number(),
  postalCode: z.string(),
  provinceId: z.number(),
  cityId: z.number(),
  address: z.string()
})

export type CreateLegalUserInfoType = TypeOf<typeof LegalAddresSchema>

export default ({ readOnlyMode, uuid }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [provinceDialog, setProvinceDialog] = useState(false)
  const [provinceQueryTemp, setProvinceQueryTemp] = useState("")
  const [cityDialog, setCityDialog] = useState(false)
  const form = useForm<CreateLegalUserInfoType>({
    resolver: zodResolver(LegalAddresSchema)
  })

  const provinces = useGetAllProvincesQuery(graphqlRequestClientWithToken)

  const cities = useGetProvinceQuery(
    graphqlRequestClientWithToken,
    {
      id: form.watch("provinceId")
    },
    {
      enabled: !!form.watch("provinceId")
    }
  )

  const submit = (data: CreateLegalUserInfoType) => {
    console.log(data)
    // const { address, cityId, phone, postalCode, provinceId } = data

    router.push(`/users/legal/${uuid}/info`)
  }
  z.setErrorMap(zodI18nMap)
  return (
    <>
      <Form {...form}>
        <form className="flex flex-col" onSubmit={form.handleSubmit(submit)}>
          <CardContainer
            titleClass={!readOnlyMode && "!border-0 font-normal"}
            title={
              readOnlyMode
                ? "اطلاعات تماس"
                : "اطلاعات خواسته شده را وارد نمایید"
            }
          >
            <div className="grid w-full grid-cols-3 grid-rows-4 gap-7 ">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>{t("common:main-number")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={readOnlyMode}
                        {...field}
                        type="text"
                        placeholder={t("common:enter")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-3 row-start-2 flex items-center gap-5 py-7">
                <hr className="h-0.5 w-6 bg-alpha-200" />
                <span className="text-alpha-500">{t("common:address")}</span>
                <hr className="h-0.5 w-full bg-alpha-200" />
              </div>
              <FormField
                control={form.control}
                name="provinceId"
                render={({ field }) => (
                  <FormItem className="col-span-1 row-start-3">
                    <FormLabel>{t("common:province")}</FormLabel>
                    <Popover
                      open={provinceDialog}
                      onOpenChange={setProvinceDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={
                              provinces.isLoading ||
                              provinces.isError ||
                              readOnlyMode
                            }
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? provinces.data?.provinces.data?.find(
                                  (province) =>
                                    province && province.id === field.value
                                )?.name
                              : t("common:choose_entity", {
                                  entity: t("common:province")
                                })}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="!z-[9999]" asChild>
                        <Command>
                          <CommandInput
                            loading={provinces.isLoading}
                            value={provinceQueryTemp}
                            onValueChange={(newQuery) => {
                              // setProvinceQuery(newQuery)
                              setProvinceQueryTemp(newQuery)
                            }}
                            placeholder={t("common:search_entity", {
                              entity: t("common:province")
                            })}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:province")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {provinces.data?.provinces.data?.map(
                              (province) =>
                                province && (
                                  <CommandItem
                                    value={province.name}
                                    key={province.id}
                                    onSelect={(value) => {
                                      form.setValue(
                                        "provinceId",
                                        provinces.data?.provinces.data?.find(
                                          (province) =>
                                            province &&
                                            province.name.toLowerCase() ===
                                              value
                                        )?.id || 0
                                      )
                                      setProvinceDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        province.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {province.name}
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
                name="cityId"
                render={({ field }) => (
                  <FormItem className="col-span-1  row-start-3">
                    <FormLabel>{t("common:city")}</FormLabel>
                    <Popover open={cityDialog} onOpenChange={setCityDialog}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={
                              cities.isFetching ||
                              cities.isLoading ||
                              !cities.data?.province.cities.length ||
                              readOnlyMode
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
                      <PopoverContent className="!z-[9999]" asChild>
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
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="col-span-1  row-start-3">
                    <FormLabel>{t("common:postalCode")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={readOnlyMode}
                        {...field}
                        placeholder={t("common:enter")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-3 row-start-4">
                    <FormLabel>{t("common:postal-address")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={readOnlyMode}
                        type="text"
                        {...field}
                        placeholder={t("common:enter")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContainer>
          {!readOnlyMode && (
            <div className=" mt-7 flex w-full flex-row-reverse gap border-t pt-6 ">
              <Button type="submit" variant="primary">
                تایید و ادامه
              </Button>
              <Link className="btn btn-md btn-secondary" href={"/users/legal"}>
                بازگشت به کاربران
              </Link>
            </div>
          )}
        </form>
      </Form>
    </>
  )
}
