import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useDebouncedState } from "@mantine/hooks"
import Card from "@vardast/component/Card"
import {
  ProductImageStatusEnum,
  ProductPriceStatusEnum,
  useGetAllBrandsWithoutPaginationQuery,
  useGetAllCategoriesV2Query
} from "@vardast/graphql/generated"
import {
  imageExistence,
  productPriceOptions,
  statusesOfAvailability
} from "@vardast/lib/AvailabilityStatus"
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
import {
  LucideCheck,
  LucideChevronsUpDown,
  LucideSearch,
  LucideX
} from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { UseFormReturn } from "react-hook-form"

import {
  FilterFields,
  ProductQueryParams
} from "@/app/(admin)/products/components/Products"

type ProductFilterProps = {
  form: UseFormReturn<FilterFields, any, undefined>
  setProductQueryParams: Dispatch<SetStateAction<ProductQueryParams>>
}
export const ProductsFilter = ({
  form,
  setProductQueryParams
}: ProductFilterProps) => {
  const [brandsQuery, setBrandsQuery] = useDebouncedState("", 500)
  const [categoryQuery, setCategoryQuery] = useDebouncedState("", 500)
  const [categoryIds, setCategoryIds] = useState<number[]>([])
  const [isActiveDialog, setIsActiveDialog] = useState(false)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [brandDialog, setBrandDialog] = useState(false)
  const [descriptionDialog, setDescriptionDialog] = useState(false)
  const [priceStatusDialog, setPriceStatusDialog] = useState(false)
  const [imageStatusDialog, setImageStatusDialog] = useState(false)

  const { t } = useTranslation()

  const categories = useGetAllCategoriesV2Query(graphqlRequestClientWithToken, {
    indexCategoryInput: {
      name: categoryQuery
    }
  })
  const brands = useGetAllBrandsWithoutPaginationQuery(
    graphqlRequestClientWithToken,
    {
      indexBrandInput: {
        name: brandsQuery
      }
    }
  )

  const handleDeleteSelectedCategories = (index: number | undefined) => {
    if (index !== undefined) {
      const updatedList = [...categoryIds]
      updatedList.splice(index, 1)
      setCategoryIds(updatedList)
    }
  }

  const handleSubmit = () => {
    setProductQueryParams({
      query: form.getValues("query"),
      categoryIds: form.getValues("categoryIds"),
      isActive: form.getValues("isActive") as string,
      brandId: form.getValues("brandId") as number,
      sku: form.getValues("sku") as string,
      hasPrice: form.getValues("hasPrice"),
      hasImage: form.getValues("hasImage")
    })
  }
  const handleReset = () => {
    form.reset()
    setProductQueryParams({
      query: form.getValues("query"),
      categoryIds: form.getValues("categoryIds"),
      isActive: form.getValues("isActive") as string,
      brandId: form.getValues("brandId") as number,
      sku: form.getValues("sku") as string,
      hasPrice: form.getValues("hasPrice"),
      hasImage: form.getValues("hasImage")
    })
  }
  const statusesOfActivation = [
    { status: "فعال", value: "true" },
    {
      status: "غیرفعال",
      value: "false"
    }
  ]

  useEffect(() => {
    const uniqueCategoryIds = [...new Set(categoryIds)]
    form.setValue("categoryIds", uniqueCategoryIds)
  }, [categoryIds, form])
  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <div className="flex flex-col justify-between gap-6">
            <div className="grid grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="query"
                render={(_) => (
                  <FormItem>
                    <FormLabel>{t("common:product_name")}</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
                        <LucideSearch className="h-6 w-6 text-primary" />
                        <Input
                          autoFocus
                          defaultValue=""
                          onChange={(e) => {
                            form.setValue("query", e.target.value)
                          }}
                          type="text"
                          placeholder="نام کالا"
                          className="flex h-full w-full
                          items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                           focus:!ring-0 disabled:bg-alpha-100"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={(_) => (
                  <FormItem>
                    <FormLabel>{t("common:product_sku")}</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
                        <LucideSearch className="h-6 w-6 text-primary" />
                        <Input
                          autoFocus
                          defaultValue=""
                          onChange={(e) => {
                            form.setValue("sku", e.target.value)
                          }}
                          type="text"
                          placeholder="SKU"
                          className="flex h-full w-full
                        items-center
                        gap-2
                        rounded-lg
                        bg-alpha-100
                        px-4
                         focus:!ring-0 disabled:bg-alpha-100"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryIds"
                render={(_) => (
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
                            className="input-field flex items-center gap-1 overflow-hidden text-start"
                          >
                            {categoryIds.length > 0 ? (
                              categoryIds.map((item, index) => (
                                <span
                                  key={index}
                                  className="tag tag-sm tag-primary py-0"
                                  onClick={(e) => {
                                    console.log(index)
                                    e.stopPropagation()
                                    handleDeleteSelectedCategories(index)
                                  }}
                                >
                                  {
                                    categories.data?.allCategoriesV2.find(
                                      (item2) => item2.id === item
                                    )?.title
                                  }
                                  <LucideX size="10" />
                                </span>
                              ))
                            ) : (
                              <span>
                                {t("common:choose_entity", {
                                  entity: t("common:category")
                                })}
                              </span>
                            )}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput
                            loading={categories.isLoading}
                            onValueChange={(newQuery) => {
                              setCategoryQuery(newQuery)
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
                                      const selectedId =
                                        categories.data.allCategoriesV2.find(
                                          (item) =>
                                            item.title.toLocaleLowerCase() ===
                                            value
                                        )?.id
                                      setCategoryIds((prev) => [
                                        ...prev,
                                        selectedId as number
                                      ])
                                      setCategoryDialog(false)
                                    }}
                                  >
                                    {/* <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        categoryIds &&
                                          categoryIds.includes(
                                            field.value as number
                                          )
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    /> */}
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
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:producer")}</FormLabel>
                    <Popover open={brandDialog} onOpenChange={setBrandDialog}>
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
                                  (brand) => brand && brand.id === field.value
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
                            placeholder={t("common:search_entity", {
                              entity: t("common:producer")
                            })}
                            onValueChange={(newQuery) => {
                              setBrandsQuery(newQuery)
                            }}
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
                                            item.name.toLowerCase() === value
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
                name="hasDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>معرفی برند</FormLabel>
                    <Popover
                      open={descriptionDialog}
                      onOpenChange={setDescriptionDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {statusesOfAvailability.find(
                              (st) => st.value === field.value
                            )?.status || t("common:select_placeholder")}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {statusesOfAvailability.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("hasDescription", value)
                                  setDescriptionDialog(false)
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hasPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:price_list")}</FormLabel>
                    <Popover
                      open={priceStatusDialog}
                      onOpenChange={setPriceStatusDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {productPriceOptions.find(
                              (st) => st.value === field.value
                            )?.status || t("common:select_placeholder")}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {productPriceOptions.map((st) => (
                              <CommandItem
                                value={st.value as ProductPriceStatusEnum}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("hasPrice", value.toUpperCase())
                                  setPriceStatusDialog(false)
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("common:entity_status", {
                        entity: t("common:product")
                      })}
                    </FormLabel>
                    <Popover
                      open={isActiveDialog}
                      onOpenChange={setIsActiveDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {statusesOfActivation.find(
                              (st) => st.value === field.value
                            )?.status || t("common:select_placeholder")}
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
                            {statusesOfActivation.map((st) => (
                              <CommandItem
                                value={st.value}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("isActive", value)
                                  setIsActiveDialog(false)
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
              <FormField
                control={form.control}
                name="hasImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تصویر محصول</FormLabel>
                    <Popover
                      open={imageStatusDialog}
                      onOpenChange={setImageStatusDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {imageExistence.find(
                              (st) => st.value === field.value
                            )?.status || t("common:select_placeholder")}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:producer")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {imageExistence.map((st) => (
                              <CommandItem
                                value={st.value as ProductImageStatusEnum}
                                key={st.status}
                                onSelect={(value) => {
                                  form.setValue("hasImage", value.toUpperCase())
                                  setImageStatusDialog(false)
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 gap-6">
              <div className="col-start-4 flex justify-end gap-3">
                <Button
                  className="w-full"
                  variant="secondary"
                  type="reset"
                  onClick={handleReset}
                >
                  {t("common:remove_filter")}
                </Button>
                <Button className="w-full" variant="primary" type="submit">
                  {t("common:submit_filter")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  )
}
