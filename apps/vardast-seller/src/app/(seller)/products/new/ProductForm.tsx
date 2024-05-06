"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebouncedState } from "@mantine/hooks"
import Dropzone from "@vardast/component/Dropzone"
import Loading from "@vardast/component/Loading"
import {
  CreateProductSellerInput,
  Image,
  useCreateAttributeValueMutation,
  useCreateImageMutation,
  useCreateProductFromSellerMutation,
  useGetAllBrandsWithoutPaginationQuery,
  useGetAllCategoriesV2Query,
  useGetAllUomsWithoutPaginationQuery,
  useGetAttributesOfACategoryQuery
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClient from "@vardast/query/queryClients/graphqlRequestClient"
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
import { Textarea } from "@vardast/ui/textarea"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import {
  LucideAlertOctagon,
  LucideCheck,
  LucideChevronsUpDown
} from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useFieldArray, useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

export type AttributeValueTempState = { attributeId: number; value: string }
type ProductFormProps = { isMobile: boolean }

const ProductForm = ({ isMobile }: ProductFormProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [images, setImages] = useState<
    { uuid: string; expiresAt: string; image?: Image }[]
  >([])
  const [errors, setErrors] = useState<ClientError>()
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [attributeDialog, setAttributeDialog] = useState(false)
  const [brandDialog, setBrandDialog] = useState(false)
  const [categoryQuery, setCategoryQuery] = useDebouncedState("", 500)
  const [categoryQueryTemp, setCategoryQueryTemp] = useState("")
  const { data: session } = useSession()

  const [brandsQuery, setBrandsQuery] = useDebouncedState("", 500)
  const [brandsQueryTemp, setBrandsQueryTemp] = useState("")

  const createImageMutation = useCreateImageMutation(
    graphqlRequestClient(session)
  )

  const createAttributeValueMutation = useCreateAttributeValueMutation(
    graphqlRequestClient(session),
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        form.reset()
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:attribute")
          }),
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  const createProductMutation = useCreateProductFromSellerMutation(
    graphqlRequestClient(session),
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: async (data) => {
        Promise.all(
          images.map(async (image, idx) => {
            await createImageMutation.mutateAsync({
              createImageInput: {
                productId: data.createProductFromSeller.id,
                fileUuid: image.uuid,
                sort: idx,
                isPublic: true
              }
            })
          })
        ).then(() => {
          const attributesData = form.getValues("attributes")
          if (attributesData) {
            Promise.all(
              attributesData.map(async (attr) => {
                await createAttributeValueMutation.mutateAsync({
                  createAttributeValueInput: {
                    attributeId: attr.id,
                    value: attr.value,
                    sku: "",
                    isVariant: true,
                    productId: data.createProductFromSeller.id
                  }
                })
              })
            ).then(() => {
              toast({
                description: t("common:entity_added_successfully", {
                  entity: t("common:product")
                }),
                duration: 2000,
                variant: "success"
              })
              router.replace("/seller-panel/products/my-products")
              return
            })
          }
        })
        // toast({
        //   description: t("common:entity_added_error", {
        //     entity: t("common:product")
        //   }),
        //   duration: 2000,
        //   variant: "danger"
        // })
      }
    }
  )

  z.setErrorMap(zodI18nMap)
  const CreateProductSchema = z.object({
    name: z.string(),
    categoryId: z.number(),
    brandId: z.number(),
    uomId: z.number(),
    description: z.string().optional(),
    metaDescription: z.string().optional(),
    attributes: z
      .array(
        z.object({
          name: z.string(),
          id: z.number(),
          value: z.string().optional()
        })
      )
      .optional()
  })
  type CreateProductType = TypeOf<typeof CreateProductSchema>

  const form = useForm<CreateProductType>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      metaDescription: "",
      categoryId: 0,
      brandId: 0,
      uomId: 0,
      attributes: []
    }
  })

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "attributes"
  })

  const attributesQuery = useGetAttributesOfACategoryQuery(
    graphqlRequestClient(session),
    {
      id: form.watch("categoryId")
    },
    {
      enabled: false
    }
  )

  const categories = useGetAllCategoriesV2Query(graphqlRequestClient(session), {
    indexCategoryInput: {
      name: categoryQuery
    }
  })
  const brands = useGetAllBrandsWithoutPaginationQuery(
    graphqlRequestClient(session),
    {
      indexBrandInput: {
        perPage: 10,
        name: brandsQuery
      }
    }
  )
  const uoms = useGetAllUomsWithoutPaginationQuery(
    graphqlRequestClient(session)
  )

  const onSubmit = (data: CreateProductType) => {
    let queryInput: CreateProductSellerInput = {
      name: data.name,
      categoryId: data.categoryId,
      brandId: data.brandId,
      uomId: data.uomId
      // attributeId: data.attributeId
    }

    if (data.description) {
      queryInput = { ...queryInput, description: data.description }
    }

    createProductMutation.mutate({
      createProductSellerInput: queryInput
    })
  }

  useEffect(() => {
    categories.refetch()
  }, [categories, categoryQuery])

  useEffect(() => {
    brands.refetch()
  }, [brands, brandsQuery])

  useEffect(() => {
    const getAttr = async () => {
      if (form.watch("categoryId")) {
        const tempAttr = await attributesQuery.refetch()
        const arrayTemp: CreateProductType["attributes"] = []

        tempAttr.data?.categoryAttribuite.attributes.forEach((item) => {
          if (item?.id && item?.name) {
            arrayTemp.push({
              name: item.name,
              id: item.id,
              value: ""
            })
          }
        })
        replace(arrayTemp.length ? arrayTemp : [])
      }
    }
    getAttr()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("categoryId")])

  return (
    <>
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
        <form
          className="flex h-full flex-1 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="create-product flex-1">
            <div className="flex flex-col">
              {isMobile ? (
                <>
                  <div className="flex flex-col gap-6">
                    {" "}
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common:producer")}</FormLabel>
                          <Popover
                            open={brandDialog}
                            onOpenChange={setBrandDialog}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  disabled={brands.isLoading || brands.isError}
                                  noStyle
                                  role="combobox"
                                  className="input-field flex items-center text-start"
                                >
                                  {field.value
                                    ? brands.data?.brandsWithoutPagination.find(
                                        (brand) =>
                                          brand && brand.id === field.value
                                      )?.name
                                    : t("common:choose_entity", {
                                        entity: t("common:producer")
                                      })}
                                  <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Command>
                                <CommandInput
                                  loading={brands.isLoading}
                                  value={brandsQueryTemp}
                                  defaultValue={brandsQuery}
                                  onValueChange={(newQuery) => {
                                    setBrandsQuery(newQuery)
                                    setBrandsQueryTemp(newQuery)
                                  }}
                                  placeholder={t("common:search_entity", {
                                    entity: t("common:producer")
                                  })}
                                />
                                <CommandEmpty>
                                  {t("common:no_entity_found", {
                                    entity: t("common:producer")
                                  })}
                                </CommandEmpty>
                                <CommandGroup>
                                  {brands.data?.brandsWithoutPagination.map(
                                    (brand) =>
                                      brand && (
                                        <CommandItem
                                          value={brand.name}
                                          key={brand.id}
                                          onSelect={(value) => {
                                            form.setValue(
                                              "brandId",
                                              brands.data?.brandsWithoutPagination.find(
                                                (item) =>
                                                  item &&
                                                  item.name.toLowerCase() ===
                                                    value
                                              )?.id || 0
                                            )
                                            setBrandDialog(false)
                                          }}
                                        >
                                          <LucideCheck
                                            className={mergeClasses(
                                              "mr-2 h-4 w-4",
                                              brand.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {brand.name}
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
                                    categories.isLoading || categories.isError
                                  }
                                  noStyle
                                  role="combobox"
                                  className="input-field flex items-center text-start"
                                >
                                  {field.value
                                    ? categories.data?.allCategoriesV2.find(
                                        (category) =>
                                          category &&
                                          category.id === field.value
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
                                  defaultValue={categoryQuery}
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
                                                  item.title.toLowerCase() ===
                                                    value
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
                    {attributesQuery.isFetching ? (
                      <div className="flex flex-col gap-6">
                        <Loading message="در حال بارگیری مشخصه‌ها..." />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        {fields.map((attribute, index) => (
                          <>
                            <FormField
                              control={form.control}
                              name={`attributes.${index}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{attribute.name}</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder={t("common:add_entity", {
                                        entity: t("common:attribute")
                                      })}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ))}
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name="uomId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common:uom")}</FormLabel>
                          <Popover
                            open={attributeDialog}
                            onOpenChange={setAttributeDialog}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  disabled={uoms.isLoading || uoms.isError}
                                  noStyle
                                  role="combobox"
                                  className="input-field flex items-center text-start"
                                >
                                  {field.value
                                    ? uoms.data?.uomsWithoutPagination.find(
                                        (uom) => uom && uom.id === field.value
                                      )?.name
                                    : t("common:choose_entity", {
                                        entity: t("common:uom")
                                      })}
                                  <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Command>
                                <CommandInput
                                  placeholder={t("common:search_entity", {
                                    entity: t("common:uom")
                                  })}
                                />
                                <CommandEmpty>
                                  {t("common:no_entity_found", {
                                    entity: t("common:uom")
                                  })}
                                </CommandEmpty>
                                <CommandGroup>
                                  {uoms.data?.uomsWithoutPagination.map(
                                    (uom) =>
                                      uom && (
                                        <CommandItem
                                          value={uom.name}
                                          key={uom.id}
                                          onSelect={(value) => {
                                            form.setValue(
                                              "uomId",
                                              uoms.data?.uomsWithoutPagination.find(
                                                (item) =>
                                                  item &&
                                                  item.name.toLowerCase() ===
                                                    value
                                              )?.id || 0
                                            )
                                            setAttributeDialog(false)
                                          }}
                                        >
                                          <LucideCheck
                                            className={mergeClasses(
                                              "mr-2 h-4 w-4",
                                              uom.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {uom.name}
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
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common:product_name")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("common:enter_product_name")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common:description")}</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Dropzone
                      withHeight={false}
                      uploadPath={uploadPaths.productImages}
                      onAddition={(file) => {
                        setImages((prevImages) => [
                          ...prevImages,
                          {
                            uuid: file.uuid as string,
                            expiresAt: file.expiresAt as string
                          }
                        ])
                      }}
                      onDelete={(file) => {
                        setImages((images) =>
                          images.filter((image) => image.uuid !== file.uuid)
                        )
                      }}
                    />{" "}
                    <Button
                      loading={
                        createProductMutation.isLoading ||
                        createImageMutation.isLoading ||
                        createAttributeValueMutation.isLoading
                      }
                      disabled={
                        createProductMutation.isLoading ||
                        createImageMutation.isLoading ||
                        createAttributeValueMutation.isLoading
                      }
                      type="submit"
                      block
                      className="mt justify-self-end"
                    >
                      ثبت نهایی کالا
                    </Button>
                  </div>{" "}
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-7">
                      {" "}
                      <FormField
                        control={form.control}
                        name="brandId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common:producer")}</FormLabel>
                            <Popover
                              open={brandDialog}
                              onOpenChange={setBrandDialog}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    disabled={
                                      brands.isLoading || brands.isError
                                    }
                                    noStyle
                                    role="combobox"
                                    className="input-field flex items-center text-start"
                                  >
                                    {field.value
                                      ? brands.data?.brandsWithoutPagination.find(
                                          (brand) =>
                                            brand && brand.id === field.value
                                        )?.name
                                      : t("common:choose_entity", {
                                          entity: t("common:producer")
                                        })}
                                    <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent>
                                <Command>
                                  <CommandInput
                                    loading={brands.isLoading}
                                    value={brandsQueryTemp}
                                    defaultValue={brandsQuery}
                                    onValueChange={(newQuery) => {
                                      setBrandsQuery(newQuery)
                                      setBrandsQueryTemp(newQuery)
                                    }}
                                    placeholder={t("common:search_entity", {
                                      entity: t("common:producer")
                                    })}
                                  />
                                  <CommandEmpty>
                                    {t("common:no_entity_found", {
                                      entity: t("common:producer")
                                    })}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {brands.data?.brandsWithoutPagination.map(
                                      (brand) =>
                                        brand && (
                                          <CommandItem
                                            value={brand.name}
                                            key={brand.id}
                                            onSelect={(value) => {
                                              form.setValue(
                                                "brandId",
                                                brands.data?.brandsWithoutPagination.find(
                                                  (item) =>
                                                    item &&
                                                    item.name.toLowerCase() ===
                                                      value
                                                )?.id || 0
                                              )
                                              setBrandDialog(false)
                                            }}
                                          >
                                            <LucideCheck
                                              className={mergeClasses(
                                                "mr-2 h-4 w-4",
                                                brand.id === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {brand.name}
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
                                      categories.isLoading || categories.isError
                                    }
                                    noStyle
                                    role="combobox"
                                    className="input-field flex items-center text-start"
                                  >
                                    {field.value
                                      ? categories.data?.allCategoriesV2.find(
                                          (category) =>
                                            category &&
                                            category.id === field.value
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
                                    defaultValue={categoryQuery}
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
                                                    item.title.toLowerCase() ===
                                                      value
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
                    </div>
                    {attributesQuery.isFetching ? (
                      <div className="flex flex-col gap-6">
                        <Loading message="در حال بارگیری مشخصه‌ها..." />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-7">
                        {fields.map((attribute, index) => (
                          <>
                            <FormField
                              control={form.control}
                              name={`attributes.${index}.value`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{attribute.name}</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder={t("common:add_entity", {
                                        entity: t("common:attribute")
                                      })}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-7">
                      <FormField
                        control={form.control}
                        name="uomId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common:uom")}</FormLabel>
                            <Popover
                              open={attributeDialog}
                              onOpenChange={setAttributeDialog}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    disabled={uoms.isLoading || uoms.isError}
                                    noStyle
                                    role="combobox"
                                    className="input-field flex items-center text-start"
                                  >
                                    {field.value
                                      ? uoms.data?.uomsWithoutPagination.find(
                                          (uom) => uom && uom.id === field.value
                                        )?.name
                                      : t("common:choose_entity", {
                                          entity: t("common:uom")
                                        })}
                                    <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent>
                                <Command>
                                  <CommandInput
                                    placeholder={t("common:search_entity", {
                                      entity: t("common:uom")
                                    })}
                                  />
                                  <CommandEmpty>
                                    {t("common:no_entity_found", {
                                      entity: t("common:uom")
                                    })}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {uoms.data?.uomsWithoutPagination.map(
                                      (uom) =>
                                        uom && (
                                          <CommandItem
                                            value={uom.name}
                                            key={uom.id}
                                            onSelect={(value) => {
                                              form.setValue(
                                                "uomId",
                                                uoms.data?.uomsWithoutPagination.find(
                                                  (item) =>
                                                    item &&
                                                    item.name.toLowerCase() ===
                                                      value
                                                )?.id || 0
                                              )
                                              setAttributeDialog(false)
                                            }}
                                          >
                                            <LucideCheck
                                              className={mergeClasses(
                                                "mr-2 h-4 w-4",
                                                uom.id === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {uom.name}
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
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("common:product_name")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("common:enter_product_name")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common:description")}</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Dropzone
                      withHeight={false}
                      uploadPath={uploadPaths.productImages}
                      onAddition={(file) => {
                        setImages((prevImages) => [
                          ...prevImages,
                          {
                            uuid: file.uuid as string,
                            expiresAt: file.expiresAt as string
                          }
                        ])
                      }}
                      onDelete={(file) => {
                        setImages((images) =>
                          images.filter((image) => image.uuid !== file.uuid)
                        )
                      }}
                    />{" "}
                    <div className="flex justify-end">
                      <Button
                        loading={
                          createProductMutation.isLoading ||
                          createImageMutation.isLoading ||
                          createAttributeValueMutation.isLoading
                        }
                        disabled={
                          createProductMutation.isLoading ||
                          createImageMutation.isLoading ||
                          createAttributeValueMutation.isLoading
                        }
                        type="submit"
                        className="mt justify-self-end"
                      >
                        ثبت نهایی کالا
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export default ProductForm
