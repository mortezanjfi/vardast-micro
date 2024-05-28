"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import CardContainer from "@vardast/component/desktop/CardContainer"
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

type Props = { uuid: string; offerId: string }
const CreateSellerSchema = z.object({
  storeName: z.string(),
  sellerName: z.string(),
  cellPhone: z.coerce.number(),
  phone: z.coerce.number(),
  provinceId: z.number(),
  cityId: z.number(),
  address: z.string()
})
export type CreateSellerInfoType = TypeOf<typeof CreateSellerSchema>

const AddSellerInfo = ({ uuid, offerId }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [provinceQueryTemp, setProvinceQueryTemp] = useState("")
  const [provinceDialog, setProvinceDialog] = useState(false)
  const [cityDialog, setCityDialog] = useState(false)
  const form = useForm<CreateSellerInfoType>({
    resolver: zodResolver(CreateSellerSchema)
  })
  z.setErrorMap(zodI18nMap)

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
  const submit = (data: any) => {
    console.log(data)
    router.push(`/my-orders/${uuid}/add-offer-price`)
  }
  return (
    <CardContainer title="اطلاعات فروشنده">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="flex flex-col gap-7"
        >
          <div className="grid grid-cols-4 gap-7">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("common:entity_name", { entity: t("common:store") })}
                    <span> / </span>
                    {t("common:entity_name", { entity: t("common:company") })}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="وارد کنید" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    {t("common:entity_name", { entity: t("common:seller") })}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="وارد کنید" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cellPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:cellPhone")}</FormLabel>
                  <FormControl>
                    <Input
                      dir="rtl"
                      placeholder="وارد کنید"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره ثابت</FormLabel>
                  <FormControl>
                    <Input
                      dir="rtl"
                      placeholder="وارد کنید"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-5 gap-7">
            <FormField
              control={form.control}
              name="provinceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:province")}</FormLabel>
                  <Popover
                    open={provinceDialog}
                    onOpenChange={setProvinceDialog}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={provinces.isLoading || provinces.isError}
                          noStyle
                          role="combobox"
                          className="input-field flex items-center text-start"
                        >
                          {field.value
                            ? provinces.data?.provinces.data.find(
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
                    <PopoverContent>
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
                          {provinces.data?.provinces.data.map(
                            (province) =>
                              province && (
                                <CommandItem
                                  value={province.name}
                                  key={province.id}
                                  onSelect={(value) => {
                                    form.setValue(
                                      "provinceId",
                                      provinces.data.provinces.data.find(
                                        (province) =>
                                          province &&
                                          province.name.toLowerCase() === value
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
            <div className="col-span-3">
              {" "}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> {t("common:address")}</FormLabel>
                    <FormControl>
                      <Input placeholder="وارد کنید" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row-reverse border-t pt-5">
            <Button className="py-2" type="submit" variant="primary">
              تایید و ادامه
            </Button>
          </div>
        </form>
      </Form>
    </CardContainer>
  )
}

export default AddSellerInfo
