"use client"

import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebouncedState } from "@mantine/hooks"
import Card from "@vardast/component/Card"
import {
  Brand,
  useGetAllCategoriesV2Query,
  useGetAllProvincesQuery,
  useGetProvinceQuery
} from "@vardast/graphql/generated"
import { uploadPaths } from "@vardast/lib/uploadPaths"
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
import { Textarea } from "@vardast/ui/textarea"
import zodI18nMap from "@vardast/util/zodErrorMap"
import {
  ArrowUpFromLine,
  LucideCheck,
  LucideChevronsUpDown,
  LucideTrash,
  LucideWarehouse
} from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { NewBrandType } from "@/app/(admin)/brands/components/BrandForm"

type NewBrandsProps = {
  brand?: Brand
  setActiveTab: Dispatch<SetStateAction<string>>
  activeTab: string
  setNewBrandData: Dispatch<SetStateAction<NewBrandType | undefined>>
}
//zod schema
export const NewBrandInformationSchema = z.object({
  brandStatus: z.string(),
  cityId: z.number(),
  provinceId: z.number(),
  categoryId: z.number(),
  englishName: z.string().optional(),
  id: z.coerce.number(),
  brandName: z.string(),
  logoFileUuid: z.string(),
  bio: z.string()
})
export type NewBrandInformationType = TypeOf<typeof NewBrandInformationSchema>

const BrandInformationForm = ({
  brand,
  setActiveTab,
  activeTab,
  setNewBrandData
}: NewBrandsProps) => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const router = useRouter()
  // const [errors, setErrors] = useState<ClientError>()
  const logoFileFieldRef = useRef<HTMLInputElement>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  // const queryClient = useQueryClient()
  const token = session?.accessToken || null
  const [categoryQuery, setCategoryQuery] = useDebouncedState("", 500)
  const [categoryQueryTemp, setCategoryQueryTemp] = useState("")
  // const [provinceQuery, setProvinceQuery] = useDebouncedState("", 500)
  const [provinceQueryTemp, setProvinceQueryTemp] = useState("")
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [provinceDialog, setProvinceDialog] = useState(false)
  const [cityDialog, setCityDialog] = useState(false)
  const [brandStatusDialog, setBrandStatusDialog] = useState(false)

  //setting form
  const form = useForm<NewBrandInformationType>({
    resolver: zodResolver(NewBrandInformationSchema),
    defaultValues: {
      brandName: brand?.name,
      logoFileUuid: brand?.logoFile?.uuid,
      bio: brand?.bio || undefined
    }
  })

  z.setErrorMap(zodI18nMap)

  const onLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileToUpload = event.target.files[0]
      const formData = new FormData()
      formData.append("directoryPath", uploadPaths.brandLogo)
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
        form.setValue("logoFileUuid", uploadResult.uuid)

        setLogoFile(fileToUpload)
        setLogoPreview(URL.createObjectURL(fileToUpload))
      })
    }
  }

  // Get the index of the current active tab

  const categories = useGetAllCategoriesV2Query(graphqlRequestClientWithToken, {
    indexCategoryInput: {
      name: categoryQuery
    }
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
  const statuses = [
    { status: "فعال", value: "true" },
    {
      status: "غیرفعال",
      value: "false"
    }
  ]
  const submit = (data: NewBrandInformationType) => {
    setNewBrandData((prev) => ({
      ...prev!,
      generalInformation: data
    }))
    const currentIndex = ["information", "catalog", "price"].indexOf(activeTab)
    if (currentIndex !== -1 && currentIndex < 2) {
      if (currentIndex == 0) {
        console.log(currentIndex)
      }
      const nextTab = ["information", "catalog", "price_list"][currentIndex + 1]
      setActiveTab(nextTab)
    } else {
      console.log("done")
    }
  }

  return (
    <Form {...form}>
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

      <form
        noValidate
        className="relative flex flex-col gap-7 pb-7"
        onSubmit={form.handleSubmit(submit)}
      >
        <Card className="px-7 pb-52 pt-7">
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:name")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="englishName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:english_name")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:id")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
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
                              categories.isLoading || categories.isError
                            }
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? categories.data?.allCategoriesV2.find(
                                  (category) =>
                                    category && category.id === field.value
                                )?.title
                              : t("common:choose_entity", {
                                  entity: t("common:category")
                                })}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput
                            loading={categories.isLoading}
                            value={categoryQueryTemp}
                            onValueChange={(newQuery) => {
                              setCategoryQuery(newQuery)
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
                            {categories.data?.allCategoriesV2.map(
                              (category) =>
                                category && (
                                  <CommandItem
                                    value={category.title}
                                    key={category.id}
                                    onSelect={(value) => {
                                      form.setValue(
                                        "categoryId",
                                        categories.data?.allCategoriesV2.find(
                                          (item) =>
                                            item &&
                                            item.title.toLowerCase() === value
                                        )?.id || 0
                                      )
                                      setCategoryDialog(false)
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        category.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {category.title}
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
              />{" "}
              <FormField
                control={form.control}
                name="brandStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      {t("common:entity_status", {
                        entity: t("common:producer")
                      })}
                    </FormLabel>
                    <Popover
                      open={brandStatusDialog}
                      onOpenChange={setBrandStatusDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {statuses.find((st) => st.value === field.value)
                              ?.status || t("common:select_placeholder")}
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
                            {statuses.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("brandStatus", value)
                                  setBrandStatusDialog(false)
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
            </div>
            <hr />

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("common:about_entity", {
                        entity: t("common:producer")
                      })}
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="logoFileUuid"
              render={(_) => (
                <div className="flex flex-col items-start gap-6">
                  <h1>{t("common:logo")}</h1>
                  <Input
                    type="file"
                    onChange={(e) => onLogoFileChange(e)}
                    className="hidden"
                    accept="image/*"
                    ref={logoFileFieldRef}
                  />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-md border border-alpha-200">
                    {logoPreview || brand?.logoFile ? (
                      <Image
                        src={
                          logoPreview ||
                          (brand?.logoFile?.presignedUrl.url as string)
                        }
                        fill
                        alt="..."
                        className="object-contain p-3"
                      />
                    ) : (
                      <LucideWarehouse
                        className="h-8 w-8 text-alpha-400"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-7">
                    <div>
                      {" "}
                      <Button
                        size="xlarge"
                        className="flex flex-col gap-4 border-dashed"
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          logoFileFieldRef.current?.click()
                        }}
                      >
                        <ArrowUpFromLine />
                        {logoFile
                          ? logoFile.name
                          : t("common:upload_entity", {
                              entity: t("common:logo")
                            })}
                      </Button>
                      {logoPreview && (
                        <Button
                          variant="danger"
                          iconOnly
                          onClick={() => {
                            form.setValue("logoFileUuid", "")
                            setLogoFile(null)
                            setLogoPreview("")
                          }}
                        >
                          <LucideTrash className="icon" />
                        </Button>
                      )}
                      <FormMessage className="mt-8" />
                    </div>
                    <div>
                      {" "}
                      <ul className=" list-disc text-alpha-500">
                        <li>
                          ابعاد تصویر بایستی در بازه ۶۰۰x۶۰۰ تا ۲۵۰۰x۲۵۰۰ و حجم
                          آن باید کمتر از ۶ مگابایت باشد.
                        </li>
                        <li>
                          لوگو باید ۸۵٪ کل تصویر را در برگیرد و پس زمینه تصویر
                          اصلی باید کاملاً سفید باشد.
                        </li>
                        <li>
                          تصویر شما باید مربعی باشد یا ابعاد یک در یک داشته
                          باشد.
                        </li>
                        <li>فرمت تصاویر بایستی JPG یا PNG باشد.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </Card>{" "}
        <hr />
        <Card className="flex w-full justify-end gap-3">
          <Button
            className=" top-0 ml-3 px-16   py-2"
            variant="secondary"
            type="reset"
            onClick={() => {
              router.push("/brands")
            }}
          >
            {t("common:cancel")}
          </Button>
          <Button className=" top-0 px-12 py-2" type="submit">
            {t("common:next")}
          </Button>
        </Card>
      </form>
    </Form>
  )
}

export default BrandInformationForm
