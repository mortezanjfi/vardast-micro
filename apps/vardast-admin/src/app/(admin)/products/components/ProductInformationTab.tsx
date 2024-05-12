import { Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebouncedState } from "@mantine/hooks"
import Card from "@vardast/component/Card"
import {
  Product,
  useGetAllBrandsWithoutPaginationQuery,
  useGetAllCategoriesV2Query,
  useGetAllUomsWithoutPaginationQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientAdmin from "@vardast/query/queryClients/graphqlRequestClientWhitToken"
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
import { Switch } from "@vardast/ui/switch"
import { Textarea } from "@vardast/ui/textarea"
import { LucideCheck, LucideChevronsUpDown, LucideSearch } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { ProductFormNewType } from "@/app/(admin)/products/components/ProductFormNew"

type ProductInformationTabProps = {
  product: Product
  setActiveTab: Dispatch<SetStateAction<string>>
  activeTab: string
  setNewProductData: Dispatch<SetStateAction<ProductFormNewType | undefined>>
}
export const NewProductInformationSchema = z.object({
  brandId: z.number(),
  faName: z.string(),
  enName: z.string(),
  sku: z.string(),
  authenticity: z.boolean(),
  width: z.coerce.number(),
  height: z.coerce.number(),
  length: z.coerce.number(),
  weight: z.coerce.number(),
  uomId: z.number(),
  description: z.string(),
  categoryId: z.number()
})
export type NewBrandInformationType = TypeOf<typeof NewProductInformationSchema>

export const ProductInformationTab = ({}: ProductInformationTabProps) => {
  const { t } = useTranslation()
  // const [errors, setErrors] = useState<ClientError>()
  const router = useRouter()
  const [brandsQuery, setBrandsQuery] = useDebouncedState("", 500)
  const [brandDialog, setBrandDialog] = useState(false)
  const [categoryQuery, setCategoryQuery] = useDebouncedState("", 500)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [uomDialog, setUomDialog] = useState(false)

  const form = useForm<NewBrandInformationType>({
    resolver: zodResolver(NewProductInformationSchema),
    defaultValues: { authenticity: true }
  })

  //queries for drop down items
  const brands = useGetAllBrandsWithoutPaginationQuery(
    graphqlRequestClientAdmin,
    {
      indexBrandInput: {
        name: brandsQuery
      }
    }
  )

  const categories = useGetAllCategoriesV2Query(graphqlRequestClientAdmin, {
    indexCategoryInput: {
      name: categoryQuery
    }
  })
  const uoms = useGetAllUomsWithoutPaginationQuery(graphqlRequestClientAdmin)

  const submit = (data: any) => {
    console.log(data)
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
        <Card>
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-4 gap-6">
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
                            className="input-field flex items-center gap-1 overflow-hidden text-start"
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
                                      form.setValue(
                                        "categoryId",
                                        selectedId as number
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
                name="faName"
                render={() => (
                  <FormItem>
                    <FormLabel>نام کالا (فارسی)</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
                        <LucideSearch className="h-6 w-6 text-primary" />
                        <Input
                          defaultValue=""
                          onChange={(e) => {
                            form.setValue("faName", e.target.value)
                          }}
                          type="text"
                          placeholder={t("common:enter")}
                          className="flex h-full w-full
                          items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                           focus:!ring-0 disabled:bg-alpha-100"
                        />
                      </div>
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enName"
                render={() => (
                  <FormItem>
                    <FormLabel>نام کالا (انگلیسی)</FormLabel>
                    <FormControl>
                      <div className="relative flex w-full transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
                        <LucideSearch className="h-6 w-6 text-primary" />
                        <Input
                          defaultValue=""
                          onChange={(e) => {
                            form.setValue("enName", e.target.value)
                          }}
                          type="text"
                          placeholder={t("common:enter")}
                          className="flex h-full w-full
                        items-center
                        gap-2
                        rounded-lg
                        bg-alpha-100
                        px-4
                         focus:!ring-0 disabled:bg-alpha-100"
                        />
                      </div>
                    </FormControl>{" "}
                    <FormMessage />
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
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:uom")}</FormLabel>
                    <Popover open={uomDialog} onOpenChange={setUomDialog}>
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
                                            item.name.toLowerCase() === value
                                        )?.id || 0
                                      )
                                      setUomDialog(false)
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
              />{" "}
              <FormField
                control={form.control}
                name="authenticity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اصالت کالا</FormLabel>

                    <FormControl>
                      <Switch
                        size="xlarge"
                        className="flex"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="h-full rounded border border-blue-300 bg-blue-50 p-5 text-sm">
                <p>
                  دقت کنید، در صورتی که کالای غیر اصل انتخاب شود، برند کالا
                  &ldquo;متفرقه&ldquo; ثبت خواهد شد.
                </p>
              </div>
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:id")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:id")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:id")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:id")}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <hr />
            <div className="grid grid-cols-1 gap-6">
              {" "}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("common:about_entity", {
                        entity: t("common:product")
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
          </div>
        </Card>
        <hr />{" "}
        <Card className="flex w-full justify-end gap-3">
          <Button
            className=" top-0 ml-3 px-16   py-2"
            variant="secondary"
            type="reset"
            onClick={() => {
              router.push("/products")
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
