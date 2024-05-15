import { Dispatch, SetStateAction, useEffect, useState } from "react"
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@vardast/ui/dialog"
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

import { Address } from "@/app/(client)/(profile)/profile/projects/components/ProjectAddressesTab"

type AddressModalProps = {
  open: boolean
  activeTab: string
  onOpenChange: Dispatch<SetStateAction<boolean>>
  setAddresses: Dispatch<SetStateAction<Address[]>>
}
export const ModalSchema = z.object({
  title: z.string(),
  postalAddress: z.string(),
  provinceId: z.number(),
  cityId: z.number(),
  postalCode: z.coerce.number(),
  transfereeName: z.string(),
  transfereeFamilyName: z.string(),
  transfereeNumber: z.coerce.number()
})

export type CatalogModalType = TypeOf<typeof ModalSchema>

export const AddressModal = ({
  onOpenChange,
  open,
  setAddresses
}: AddressModalProps) => {
  const { t } = useTranslation()

  const [provinceDialog, setProvinceDialog] = useState(false)
  const [provinceQueryTemp, setProvinceQueryTemp] = useState("")
  const [cityDialog, setCityDialog] = useState(false)

  const form = useForm<CatalogModalType>({
    resolver: zodResolver(ModalSchema),
    defaultValues: {}
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
    data.id = new Date().getTime()
    setAddresses((prev) => [...prev, data])
    onOpenChange(false)
    console.log(data)
  }

  useEffect(() => {
    form.reset()
  }, [form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-7">
        <DialogHeader className="border-b pb">
          <DialogTitle>
            {" "}
            {t("common:add_new_entity", { entity: t("common:address") })}
          </DialogTitle>
        </DialogHeader>
        {/* {errors && (
            <Alert variant="danger">
              <LucideAlertOctagon />
              <AlertTitle>خطا</AlertTitle>
              <AlertDescription>
                {(
                  errors.response.errors?.at(0)?.extensions
                    .displayErrors as string[]
                ).map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </AlertDescription>
            </Alert>
          )} */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <div className="grid w-full grid-cols-2 grid-rows-6 gap-y-5">
              <div className="col-span-2 grid grid-cols-2 gap-x-7">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:title")}</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-x-7">
                <FormField
                  control={form.control}
                  name="provinceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common:province")}</FormLabel>
                      <Popover
                        modal
                        open={provinceDialog}
                        onOpenChange={setProvinceDialog}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled={
                                provinces.isLoading || provinces.isError
                              }
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
                    <FormItem>
                      <FormLabel>{t("common:city")}</FormLabel>
                      <Popover
                        modal
                        open={cityDialog}
                        onOpenChange={setCityDialog}
                      >
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
                                        form.setValue(
                                          "cityId",
                                          selected?.id || 0
                                        )
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
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-x-7">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:postalCode")}</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-x-7">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="postalAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:postal-address")}</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-x-7">
                <div>
                  <FormField
                    control={form.control}
                    name="transfereeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نام تحویل گیرنده</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="transfereeFamilyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نام خانوادگی تحویل گیرنده</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-x-7">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="transfereeNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:transferee-number")}</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-7 border-t pt">
              <div className="flex items-center gap-2">
                <Button
                  className="py-2"
                  variant="ghost"
                  onClick={() => {
                    onOpenChange(false)
                  }}
                >
                  انصراف
                </Button>
                <Button className="py-2" variant="primary" type="submit">
                  ذخیره آدرس
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
