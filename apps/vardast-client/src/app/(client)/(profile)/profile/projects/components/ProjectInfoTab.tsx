"use client"

import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@vardast/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type ProjectInfoTabProps = { setActiveTab: Dispatch<SetStateAction<string>> }

const ProjectInfoTab = ({ setActiveTab }: ProjectInfoTabProps) => {
  // const { t } = useTranslation()

  // const [provinceDialog, setProvinceDialog] = useState(false)
  // const [provinceQueryTemp, setProvinceQueryTemp] = useState("")
  // const [cityDialog, setCityDialog] = useState(false)

  const CreateProjectSchema = z.object({
    // postalCode: z.number(),
    name: z.string()
    // transfereeName: z.string().optional(),
    // transfereeNum: z.number().optional(),
    // provinceId: z.number().optional(),
    // cityId: z.number().optional(),
    // address: z.string().optional()
  })

  type CretaeProjectType = TypeOf<typeof CreateProjectSchema>

  const form = useForm<CretaeProjectType>({
    resolver: zodResolver(CreateProjectSchema)
  })

  z.setErrorMap(zodI18nMap)

  // const provinces = useGetAllProvincesQuery(graphqlRequestClient)
  // const cities = useGetProvinceQuery(
  //   graphqlRequestClient,
  //   {
  //     id: form.watch("provinceId")
  //   },
  //   {
  //     enabled: !!form.watch("provinceId")
  //   }
  // )

  const submit = (data: any) => {
    console.log(data)
    setActiveTab("addresses")
  }

  return (
    <div className="flex h-full w-full flex-col gap-9 py-5">
      {" "}
      <Form {...form}>
        <form
          className="flex flex-col gap-9"
          onSubmit={form.handleSubmit(submit)}
        >
          <div className="grid grid-cols-4 grid-rows-2 gap-x-7 gap-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام پروژه</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="transfereeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام تحویل گیرنده</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transfereeNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره تماس تحویل گیرنده</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:address")}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:postalCode")}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            /> */}
          </div>

          <div className="flex flex-row-reverse  border-alpha-200 pt-9">
            <Button type="submit" variant="primary">
              تایید و ادامه
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProjectInfoTab
