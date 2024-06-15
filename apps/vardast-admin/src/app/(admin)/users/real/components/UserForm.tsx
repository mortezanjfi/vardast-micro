"use client"

import { ChangeEvent, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import Card from "@vardast/component/Card"
import {
  useCreateUserMutation,
  useGetAllCountriesQuery,
  User,
  UserLanguagesEnum,
  UserStatusesEnum,
  useUpdateUserMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
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
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import { timezones } from "@vardast/util/timezones"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import {
  LucideAlertOctagon,
  LucideCheck,
  LucideChevronsUpDown,
  LucideTrash,
  LucideUser
} from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

type Props = {
  user?: User
}

const UserForm = ({ user }: Props) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()
  // const [countryId, setCountryId] = useState<string | null>(null)
  // const [timezone, setTimezone] = useState<string | null>(null)
  const avatarFileFieldRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")

  const token = session?.accessToken || null

  const createUserMutation = useCreateUserMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:user")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/users/real")
      }
    }
  )
  const updateUserMutation = useUpdateUserMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:user")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/users/real")
      }
    }
  )

  const statuses = enumToKeyValueObject(UserStatusesEnum)
  const languages = enumToKeyValueObject(UserLanguagesEnum)

  z.setErrorMap(zodI18nMap)
  const UserEditFormSchema = z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email().optional().or(z.literal("")),
      cellphone: z.string(),
      countryId: z.number(),
      timezone: z.string(),
      mustChangePassword: z.boolean().optional().default(false),
      newPassword: z.string().optional(),
      password: z.string().optional(),
      repeatPassword: z.string().optional(),
      currentPassword: z.string().optional(),
      status: z.nativeEnum(UserStatusesEnum),
      language: z.nativeEnum(UserLanguagesEnum),
      avatarUuid: z.string().optional(),
      displayRoleId: z.number().default(1)
    })
    .refine((schema) => (!user ? !!schema.password : true), {
      path: ["password"],
      message: t("zod:errors.invalid_type_received_undefined")
    })
    .refine(
      (schema) =>
        user && schema.mustChangePassword ? !!schema.newPassword : true,
      {
        path: ["newPassword"],
        message: t("zod:errors.invalid_type_received_undefined")
      }
    )
    .refine(
      (schema) => (user && schema.newPassword ? !!schema.repeatPassword : true),
      {
        path: ["repeatPassword"],
        message: t("zod:errors.invalid_type_received_undefined")
      }
    )
    .refine(
      (schema) =>
        user && schema.newPassword ? !!schema.currentPassword : true,
      {
        path: ["currentPassword"],
        message: t("zod:errors.invalid_type_received_undefined")
      }
    )
    .refine((schema) => schema.newPassword === schema.repeatPassword, {
      path: ["repeatPassword"],
      message: t("zod:errors.invalid_type_received_undefined")
    })
  type UserEditForm = TypeOf<typeof UserEditFormSchema>

  const form = useForm<UserEditForm>({
    resolver: zodResolver(UserEditFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      cellphone: user?.cellphone || "",
      countryId: user?.country.id,
      timezone: user?.timezone?.toLowerCase() || "asia/tehran",
      language: user?.language || UserLanguagesEnum.Farsi,
      mustChangePassword: user?.mustChangePassword,
      displayRoleId: user?.displayRole.id,
      status: user?.status || UserStatusesEnum.Active,
      avatarUuid: user?.avatarFile?.uuid
    }
  })

  const onAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileToUpload = event.target.files[0]
      const formData = new FormData()
      formData.append("directoryPath", uploadPaths.userAvatar)
      formData.append("file", fileToUpload)
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/base/storage/file`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`
        },
        body: formData
      }).then(async (response) => {
        if (!response.ok) {
        }

        const uploadResult = await response.json()
        form.setValue("avatarUuid", uploadResult.uuid)

        setAvatarFile(fileToUpload)
        setAvatarPreview(URL.createObjectURL(fileToUpload))
      })
    }
  }

  function onSubmit(data: UserEditForm) {
    const {
      firstName,
      lastName,
      email,
      cellphone,
      countryId,
      timezone,
      status,
      language,
      mustChangePassword,
      password,
      avatarUuid
    } = data
    if (user) {
      updateUserMutation.mutate({
        updateUserInput: {
          id: user.id,
          firstName,
          lastName,
          email,
          cellphone,
          countryId,
          timezone,
          status,
          language,
          avatarUuid
        }
      })
    } else {
      createUserMutation.mutate({
        createUserInput: {
          firstName,
          lastName,
          email,
          cellphone,
          countryId,
          timezone,
          status,
          language,
          password: password as string,
          mustChangePassword,
          displayRoleId: 1,
          avatarUuid
        }
      })
    }
  }

  const countries = useGetAllCountriesQuery(graphqlRequestClientWithToken, {
    indexCountryInput: {
      isActive: true
    }
  })

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
          <h2 className="text-xl font-black text-alpha-800 lg:text-3xl">
            {user
              ? t("common:edit_entity", { entity: t("common:user") })
              : t("common:new_entity", { entity: t("common:user") })}
          </h2>
          <Button
            className="sticky top-0"
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {t("common:save_entity", { entity: t("common:user") })}
          </Button>
        </div>
        <div className="flex flex-col gap-8">
          <Card template="1/2" title={t("common:personal_information")}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:first_name")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:last_name")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-full">
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
                name="cellphone"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>{t("common:cellphone")}</FormLabel>
                    <FormControl>
                      <Input type="phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card template="1/2" title={t("common:avatar")}>
            <div className="flex items-end gap-6">
              <Input
                type="file"
                onChange={(e) => onAvatarFileChange(e)}
                className="hidden"
                accept="image/*"
                ref={avatarFileFieldRef}
              />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                {avatarPreview || user?.avatarFile ? (
                  <Image
                    src={
                      avatarPreview ||
                      (user?.avatarFile?.presignedUrl.url as string)
                    }
                    fill
                    alt="..."
                    className="object-contain p-3"
                  />
                ) : (
                  <LucideUser
                    className="h-8 w-8 text-alpha-400"
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    avatarFileFieldRef.current?.click()
                  }}
                >
                  {avatarFile
                    ? avatarFile.name
                    : t("common:choose_entity_file", {
                        entity: t("common:avatar")
                      })}
                </Button>
                {avatarPreview && (
                  <Button
                    variant="danger"
                    iconOnly
                    onClick={() => {
                      form.setValue("avatarUuid", "")
                      setAvatarFile(null)
                      setAvatarPreview("")
                    }}
                  >
                    <LucideTrash className="icon" />
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card template="1/2" title={t("common:settings")}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:timezone")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? timezones.find(
                                  (timezon) =>
                                    timezon.title.toLowerCase() === field.value
                                )?.title
                              : t("common:choose_entity", {
                                  entity: t("common:timezone")
                                })}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput
                            placeholder={t("common:search_entity", {
                              entity: t("common:timezone")
                            })}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:timezone")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {timezones.map((timezone) => (
                              <CommandItem
                                value={timezone.title}
                                key={timezone.id}
                                onSelect={(value) => {
                                  form.setValue("timezone", value)
                                }}
                              >
                                <LucideCheck
                                  className={mergeClasses(
                                    "mr-2 h-4 w-4",
                                    timezone.title.toLowerCase() === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {timezone.title}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:status")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("status", value as UserStatusesEnum)
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
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:language")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue("language", value as UserLanguagesEnum)
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
                        {Object.keys(languages).map((type) => (
                          <SelectItem value={languages[type]} key={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card template="1/2" title={t("common:password")}>
            {user ? (
              <>
                <FormField
                  control={form.control}
                  name="mustChangePassword"
                  render={({ field }) => (
                    <FormItem className="checkbox-field">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>{t("common:change_password")}</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("mustChangePassword") === true && (
                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common:new_password")}</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="repeatPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common:repeat_password")}</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common:current_password")}</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common:password")}</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </Card>
        </div>
      </form>
    </Form>
  )
}

export default UserForm
