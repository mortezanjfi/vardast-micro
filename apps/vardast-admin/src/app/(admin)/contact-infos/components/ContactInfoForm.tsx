"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import Card from "@vardast/component/Card"
import {
  ContactInfo,
  ContactInfoRelatedTypes,
  ContactInfoTypes,
  ThreeStateSupervisionStatuses,
  useCreateContactInfoMutation,
  useGetAllCountriesQuery,
  useGetCountryQuery,
  useGetProvinceQuery,
  useUpdateContactInfoMutation
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

type ContactInfoFormProps = {
  passedContactInfo?: ContactInfo
  fallback?: string
  relatedType?: keyof typeof ContactInfoRelatedTypes
  relatedId?: number
}

const ContactInfoForm = ({
  passedContactInfo,
  fallback,
  relatedType,
  relatedId
}: ContactInfoFormProps) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()

  const createContactInfoMutation = useCreateContactInfoMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:contactInfo")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push(fallback ? fallback : "/contact-infos")
      }
    }
  )

  const updateContactInfoMutation = useUpdateContactInfoMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:contactInfo")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push(fallback ? fallback : "/contact-infos")
      }
    }
  )

  const statuses = enumToKeyValueObject(ThreeStateSupervisionStatuses)
  const contactInfoTypes = enumToKeyValueObject(ContactInfoTypes)

  z.setErrorMap(zodI18nMap)
  const CreateContactInfoSchema = z.object({
    title: z.string(),
    code: z.string(),
    number: z.string(),
    ext: z.string().optional(),
    countryId: z.number(),
    cityId: z.number(),
    provinceId: z.number(),
    isPublic: z.boolean().optional().default(true),
    sort: z.number().optional().default(0),
    status: z.nativeEnum(ThreeStateSupervisionStatuses),
    type: z.nativeEnum(ContactInfoTypes)
  })
  type CreateContactInfoType = TypeOf<typeof CreateContactInfoSchema>

  const form = useForm<CreateContactInfoType>({
    resolver: zodResolver(CreateContactInfoSchema),
    defaultValues: {
      title: passedContactInfo?.title,
      code: passedContactInfo?.code || undefined,
      number: passedContactInfo?.number,
      type: passedContactInfo?.type,
      sort: passedContactInfo?.sort,
      countryId: passedContactInfo?.country.id,
      cityId: passedContactInfo?.city.id,
      isPublic: passedContactInfo?.isPublic,
      status: passedContactInfo?.status,
      ext: passedContactInfo?.ext || ""
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

  function onSubmit(data: CreateContactInfoType) {
    const {
      isPublic,
      code,
      number,
      ext,
      sort,
      status,
      title,
      countryId,
      type
    } = data

    if (passedContactInfo) {
      updateContactInfoMutation.mutate({
        updateContactInfoInput: {
          id: passedContactInfo.id,
          title,
          code,
          number,
          ext,
          type,
          status,
          countryId,
          //   cityId,
          //   provinceId,
          isPublic,
          sort
        }
      })
    } else {
      if (relatedType && relatedId) {
        createContactInfoMutation.mutate({
          createContactInfoInput: {
            title,
            code,
            number,
            ext,
            type,
            relatedType: ContactInfoRelatedTypes[relatedType],
            relatedId: relatedId,
            status,
            countryId,
            // cityId,
            // provinceId,
            isPublic,
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
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="mb-6 mt-8 flex items-end justify-between">
          <h2 className="text-3xl font-black text-alpha-800">
            {passedContactInfo
              ? t("common:edit_entity", { entity: t("common:contactInfo") })
              : t("common:new_entity", { entity: t("common:contactInfo") })}
          </h2>
          <Button
            className="sticky top-0"
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {t("common:save_entity", { entity: t("common:contactInfo") })}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:type")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("type", value as ContactInfoTypes)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("common:select_placeholder")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(contactInfoTypes).map((type) => (
                          <SelectItem value={contactInfoTypes[type]} key={type}>
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:phoneCode")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:number")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:phoneExt")}</FormLabel>
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
                            disabled={countries.isLoading || countries.isError}
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
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
                                    value={country.name}
                                    key={country.id}
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
                            disabled={
                              provinces.isFetching ||
                              provinces.isLoading ||
                              !provinces.data?.country.provinces.length
                            }
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
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
                                    value={province.name}
                                    key={province.id}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:status")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue(
                          "status",
                          value as ThreeStateSupervisionStatuses
                        )
                      }}
                      defaultValue={field.value}
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
                          <SelectItem value={statuses[type]} key={type}>
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

export default ContactInfoForm
