"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Address,
  AddressRelatedTypes,
  ThreeStateSupervisionStatuses,
  useCreateAddressMutation,
  useGetAllCountriesQuery,
  useGetCountryQuery,
  useGetProvinceQuery,
  useUpdateAddressMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@vardast/ui/select"
import { Switch } from "@vardast/ui/switch"
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import {
  LucideAlertOctagon,
  LucideCheck,
  LucideChevronsUpDown
} from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import Card from "../Card"

type AddressFormProps = {
  passedAddress?: Address
  fallback?: string
  relatedType?: keyof typeof AddressRelatedTypes
  relatedId?: number
}

const AddressForm = ({
  passedAddress,
  fallback,
  relatedType,
  relatedId
}: AddressFormProps) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()

  const createAddressMutation = useCreateAddressMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:address")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push(fallback ? fallback : "/addresses")
      }
    }
  )

  const updateAddressMutation = useUpdateAddressMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:address")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push(fallback ? fallback : "/addresses")
      }
    }
  )

  const statuses = enumToKeyValueObject(ThreeStateSupervisionStatuses)

  z.setErrorMap(zodI18nMap)
  const CreateAddressSchema = z.object({
    title: z.string(),
    address: z.string(),
    email: z.string().email().optional().or(z.literal("")),
    countryId: z.number(),
    cityId: z.number(),
    provinceId: z.number(),
    phone: z.string().optional(),
    fax: z.string().optional(),
    isPublic: z.boolean().optional().default(true),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    postalCode: z.string().optional(),
    sort: z.number().optional().default(0),
    status: z.nativeEnum(ThreeStateSupervisionStatuses)
  })
  type CreateAddressType = TypeOf<typeof CreateAddressSchema>

  const form = useForm<CreateAddressType>({
    resolver: zodResolver(CreateAddressSchema),
    defaultValues: {
      title: passedAddress?.title,
      address: passedAddress?.address,
      postalCode: passedAddress?.postalCode || "",
      status: passedAddress?.status,
      isPublic: passedAddress?.isPublic,
      sort: passedAddress?.sort,
      cityId: passedAddress?.city.id,
      provinceId: passedAddress?.province.id
    }
  })

  const countries = useGetAllCountriesQuery(graphqlRequestClientWithToken, {
    indexCountryInput: {
      isActive: true
    }
  })
  const provinces = useGetCountryQuery(
    graphqlRequestClientWithToken,
    {
      id: form.watch("countryId")
    },
    {
      enabled: !!form.watch("countryId")
    }
  )
  const cities = useGetProvinceQuery(
    graphqlRequestClientWithToken,
    {
      id: form.watch("provinceId")
    },
    {
      enabled: !!form.watch("provinceId")
    }
  )

  function onSubmit(data: CreateAddressType) {
    const {
      address,
      isPublic,
      latitude,
      longitude,
      postalCode,
      sort,
      status,
      title,
      countryId,
      cityId,
      provinceId
    } = data

    if (passedAddress) {
      updateAddressMutation.mutate({
        updateAddressInput: {
          id: passedAddress.id,
          title,
          address,
          status,
          countryId,
          cityId,
          provinceId,
          isPublic,
          latitude,
          longitude,
          postalCode,
          sort
        }
      })
    } else {
      if (relatedType && relatedId) {
        createAddressMutation.mutate({
          createAddressInput: {
            title,
            address,
            relatedType: AddressRelatedTypes[relatedType],
            relatedId: relatedId,
            status,
            countryId,
            cityId,
            provinceId,
            isPublic,
            latitude,
            longitude,
            postalCode,
            sort
          }
        })
      }
    }
  }

  return (
    <Form {...form}>
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
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-6 mt-8 flex items-end justify-between">
          <h2 className="text-3xl font-black text-alpha-800">
            {passedAddress
              ? t("common:edit_entity", { entity: t("common:address") })
              : t("common:new_entity", { entity: t("common:address") })}
          </h2>
          <Button
            className="sticky top-0"
            disabled={form.formState.isSubmitting}
            loading={form.formState.isSubmitting}
            type="submit"
          >
            {t("common:save_entity", { entity: t("common:address") })}
          </Button>
        </div>
        <div className="flex flex-col gap-8">
          <Card>
            <div className="grid grid-cols-2 gap-6">
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
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:address")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:country")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className="input-field flex items-center text-start"
                            disabled={countries.isLoading || countries.isError}
                            noStyle
                            role="combobox"
                          >
                            {field.value
                              ? countries.data?.countries.data.find(
                                  (country) =>
                                    country && country.id === field.value
                                )?.name
                              : t("common:choose_entity", {
                                  entity: t("common:country")
                                })}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput
                            placeholder={t("common:search_entity", {
                              entity: t("common:country")
                            })}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:country")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {countries.data?.countries.data.map(
                              (country) =>
                                country && (
                                  <CommandItem
                                    key={country.id}
                                    value={country.name}
                                    onSelect={(value) => {
                                      const selected =
                                        countries.data?.countries.data.find(
                                          (item) => item?.name === value
                                        )
                                      form.setValue(
                                        "countryId",
                                        selected?.id || 0
                                      )
                                      form.setValue("provinceId", 0)
                                      form.setValue("cityId", 0)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        country.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {country.name}
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
                name="provinceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:province")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className="input-field flex items-center text-start"
                            disabled={
                              provinces.isFetching ||
                              provinces.isLoading ||
                              !provinces.data?.country.provinces.length
                            }
                            noStyle
                            role="combobox"
                          >
                            {field.value
                              ? provinces.data?.country.provinces.find(
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
                            {provinces.data?.country.provinces.map(
                              (province) =>
                                province && (
                                  <CommandItem
                                    key={province.id}
                                    value={province.name}
                                    onSelect={(value) => {
                                      const selected =
                                        provinces.data?.country.provinces.find(
                                          (item) => item?.name === value
                                        )
                                      form.setValue(
                                        "provinceId",
                                        selected?.id || 0
                                      )
                                      form.setValue("cityId", 0)
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className="input-field flex items-center text-start"
                            disabled={
                              cities.isFetching ||
                              cities.isLoading ||
                              !cities.data?.province.cities.length
                            }
                            noStyle
                            role="combobox"
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
                                    key={city.id}
                                    value={city.name}
                                    onSelect={(value) => {
                                      const selected =
                                        cities.data?.province.cities.find(
                                          (item) => item?.name === value
                                        )
                                      form.setValue("cityId", selected?.id || 0)
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
                  <FormItem>
                    <FormLabel>{t("common:postalCode")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:email")}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                    <FormLabel>{t("common:phone")}</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:fax")}</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:status")}</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        form.setValue(
                          "status",
                          value as ThreeStateSupervisionStatuses
                        )
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("common:select_placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(statuses).map((type) => (
                          <SelectItem key={type} value={statuses[type]}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:display_sort")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel noStyle>{t("common:visibility")}</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
        </div>
      </form>
    </Form>
  )
}

export default AddressForm
