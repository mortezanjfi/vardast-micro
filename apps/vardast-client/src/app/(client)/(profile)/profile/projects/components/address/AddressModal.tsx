import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useQueryClient } from "@tanstack/react-query"
import {
  CreateAddressProjectInput,
  UpdateProjectAddressInput,
  useAssignAddressProjectMutation,
  useGetAllProvincesQuery,
  useGetProvinceQuery,
  useUpdateProjectAddressMutation
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
import {
  cellphoneNumberSchema,
  postalCodeSchema
} from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import {
  LucideAlertOctagon,
  LucideCheck,
  LucideChevronsUpDown
} from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import {
  ProjectAddressCartProps,
  SELECTED_ITEM_TYPE
} from "@/app/(client)/(profile)/profile/projects/components/address/ProjectAddressesTab"

export const AddAddressModalFormSchema = z.object({
  title: z.string(),
  provinceId: z.number(),
  cityId: z.number(),
  postalCode: postalCodeSchema,
  address: z.string(),
  delivery_name: z.string(),
  delivery_contact: cellphoneNumberSchema
})

export type AddAddressModalFormType = TypeOf<typeof AddAddressModalFormSchema>

export const AddressModal = ({
  onCloseModal,
  selectedAddresses,
  uuid
}: ProjectAddressCartProps) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const [provinceDialog, setProvinceDialog] = useState(false)
  // const [provinceQueryTemp, setProvinceQueryTemp] = useState("")
  const [cityDialog, setCityDialog] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<AddAddressModalFormType>({
    resolver: zodResolver(AddAddressModalFormSchema)
  })

  z.setErrorMap(zodI18nMap)

  const provinces = useGetAllProvincesQuery(graphqlRequestClientWithToken, {
    indexProvinceInput: {
      perPage: 32
    }
  })

  const cities = useGetProvinceQuery(
    graphqlRequestClientWithToken,
    {
      id: form.watch("provinceId")
    },
    {
      enabled: !!form.watch("provinceId")
    }
  )

  const assignAddressProjectMutation = useAssignAddressProjectMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
        onCloseModal()
      }
    }
  )

  const updateProjectAddressMutation = useUpdateProjectAddressMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
        onCloseModal()
      }
    }
  )

  const onSubmit = (data: any) => {
    if (selectedAddresses?.data) {
      return updateProjectAddressMutation.mutate({
        updateProjectAddressInput: {
          ...(data as UpdateProjectAddressInput),
          addressId: selectedAddresses?.data?.id,
          projectId: +uuid
        }
      })
    }
    assignAddressProjectMutation.mutate({
      createAddressProjectInput: data as CreateAddressProjectInput,
      projectId: +uuid
    })
  }

  useEffect(() => {
    if (
      selectedAddresses?.type === SELECTED_ITEM_TYPE.EDIT &&
      selectedAddresses?.data
    ) {
      form.setValue("title", selectedAddresses?.data?.title)
      form.setValue("provinceId", +selectedAddresses?.data?.province.id)
      form.setValue("cityId", +selectedAddresses?.data?.city.id)
      form.setValue("postalCode", selectedAddresses?.data?.postalCode)
      form.setValue("address", selectedAddresses?.data?.address)
      form.setValue("delivery_name", selectedAddresses?.data?.delivery_name)
      form.setValue(
        "delivery_contact",
        selectedAddresses?.data?.delivery_contact
      )
    }
    return () => form.reset()
  }, [selectedAddresses, selectedAddresses?.data])

  return (
    <Dialog
      open={
        selectedAddresses?.type === SELECTED_ITEM_TYPE.ADD ||
        selectedAddresses?.type === SELECTED_ITEM_TYPE.EDIT
      }
      onOpenChange={onCloseModal}
    >
      <DialogContent className="gap-7">
        <DialogHeader className="border-b pb">
          <DialogTitle>
            {t("common:add_new_entity", { entity: t("common:address") })}
          </DialogTitle>
        </DialogHeader>
        {errors && (
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
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full grid-cols-2 gap-x gap-y-9">
              <div className="col-span-2 grid grid-cols-2 gap-x">
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
                            disabled={provinces.isLoading || provinces.isError}
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
                          {/* <CommandInput
                              loading={provinces.isLoading}
                              value={provinceQueryTemp}
                              onValueChange={(newQuery) => {
                                // setProvinceQuery(newQuery)
                                setProvinceQueryTemp(newQuery)
                              }}
                              placeholder={t("common:search_entity", {
                                entity: t("common:province")
                              })}
                            /> */}
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:province")
                            })}
                          </CommandEmpty>
                          <CommandGroup className="max-h-[150px] overflow-y-scroll">
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
                          {/* <CommandInput
                              placeholder={t("common:search_entity", {
                                entity: t("common:city")
                              })}
                            /> */}
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:city")
                            })}
                          </CommandEmpty>
                          <CommandGroup className="max-h-[150px] overflow-y-scroll">
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
                name="delivery_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:transferee-name-family")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="delivery_contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:transferee-number")}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder={digitsEnToFa("09*********")}
                        {...field}
                        onChange={(e) =>
                          e.target.value.length <= 11 &&
                          field.onChange(digitsEnToFa(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
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
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder={digitsEnToFa("**********")}
                        {...field}
                        onChange={(e) =>
                          e.target.value.length <= 10 &&
                          field.onChange(digitsEnToFa(e.target.value))
                        }
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
                  <FormItem className="col-span-2">
                    <FormLabel>{t("common:postal-address")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-7 border-t pt">
              <div className="flex items-center gap-2">
                <Button
                  className="py-2"
                  variant="ghost"
                  onClick={() => {
                    onCloseModal()
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
