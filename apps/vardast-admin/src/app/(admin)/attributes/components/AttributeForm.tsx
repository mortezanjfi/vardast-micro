"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Attribute,
  AttributeTypesEnum,
  Category,
  useCreateAttributeMutation,
  useGetAllCategoriesV2Query,
  useGetAllUomsWithoutPaginationQuery,
  useUpdateAttributeMutation
} from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import graphqlRequestClientAdmin from "@vardast/query/queryClients/graphqlRequestClientWhitToken"
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
import { TagInput } from "@vardast/ui/tag-input"
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

type AttributeFormProps = {
  attribute?: Attribute
  categoryId?: string
}

const AttributeForm = ({ attribute, categoryId }: AttributeFormProps) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    (attribute?.categories as Category[]) || []
  )
  const [values, setValues] = useState<string[]>(
    (attribute?.values?.options as string[]) || []
  )
  const [errors, setErrors] = useState<ClientError>()

  const attributeTypes = enumToKeyValueObject(AttributeTypesEnum)

  const createAttributeMutation = useCreateAttributeMutation(
    graphqlRequestClientAdmin,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:attribute")
          }),
          duration: 2000,
          variant: "success"
        })
        if (categoryId) {
          router.back()
        } else {
          router.push("/attributes")
        }
      }
    }
  )

  const updateAttributeMutation = useUpdateAttributeMutation(
    graphqlRequestClientAdmin,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:attribute")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/attributes")
      }
    }
  )

  z.setErrorMap(zodI18nMap)
  const CreateAttributeSchema = z.object({
    name: z.string().min(1),
    slug: z.string(),
    type: z.nativeEnum(AttributeTypesEnum),
    uomId: z.number().optional(),
    isPublic: z.boolean().optional(),
    isFilterable: z.boolean().optional(),
    isRequired: z.boolean().optional()
  })
  type CreateAttributeType = TypeOf<typeof CreateAttributeSchema>

  const form = useForm<CreateAttributeType>({
    resolver: zodResolver(CreateAttributeSchema),
    defaultValues: {
      name: attribute?.name,
      slug: attribute?.slug,
      type: attribute?.type,
      uomId: attribute?.uom?.id,
      isRequired: attribute?.isRequired,
      isFilterable: attribute?.isFilterable,
      isPublic: attribute?.isPublic
    }
  })

  const name = form.watch("name")
  const type = form.watch("type")

  function onSubmit(data: CreateAttributeType) {
    const { name, slug, type, uomId, isFilterable, isPublic, isRequired } = data

    if (attribute) {
      updateAttributeMutation.mutate({
        updateAttributeInput: {
          id: attribute.id,
          name,
          slug,
          type,
          uomId,
          values: {
            options: values
          },
          isFilterable,
          isPublic,
          isRequired,
          categoryIds: categoryId
            ? [+categoryId]
            : selectedCategories.map((item) => item.id)
        }
      })
    } else {
      createAttributeMutation.mutate({
        createAttributeInput: {
          name,
          slug,
          type,
          uomId,
          values: {
            options: values
          },
          isFilterable,
          isPublic,
          isRequired,
          categoryIds: categoryId
            ? [+categoryId]
            : selectedCategories.map((item) => item.id)
        }
      })
    }
  }

  // const productsVocabulary = useGetVocabularyQuery(graphqlRequestClientAdmin, {
  //   slug: "product_categories"
  // })

  const categories = useGetAllCategoriesV2Query(graphqlRequestClientAdmin, {
    indexCategoryInput: {
      // vocabularyId: productsVocabulary.data?.vocabulary.id
    }
  })

  const uoms = useGetAllUomsWithoutPaginationQuery(graphqlRequestClientAdmin)

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
            {name
              ? name
              : t("common:new_entity", { entity: t("common:attribute") })}
          </h2>
          <Button
            className="sticky top-0"
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {t("common:save_entity", { entity: t("common:attribute") })}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
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
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:slug")}</FormLabel>
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
                    form.setValue("type", value as AttributeTypesEnum)
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
                    {Object.keys(attributeTypes).map((type) => (
                      <SelectItem value={attributeTypes[type]} key={type}>
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
            name="uomId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:uom")}</FormLabel>
                <Popover>
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

          {type && (
            <div className="col-span-full flex flex-col gap-6">
              {type === "CHECKBOX" && (
                <>
                  <FormItem>
                    <FormLabel>
                      {t("common:entity_options", {
                        entity: t("common:checkbox")
                      })}
                    </FormLabel>
                    <FormControl>
                      <TagInput
                        tags={values}
                        onAddition={(item) => {
                          setValues((prevValues) => {
                            const newValues = [...prevValues, item]
                            return newValues
                          })
                        }}
                        onDelete={(idx) => {
                          setValues((prevValues) => {
                            const newValues = prevValues.filter(
                              (item, index) => index !== idx
                            )
                            return newValues
                          })
                        }}
                        placeholder={t(
                          "common:entity_comma_separated_options_placeholder",
                          {
                            entity: t("common:checkbox")
                          }
                        )}
                      />
                    </FormControl>
                  </FormItem>
                  {/* <FormField
                    control={form.control}
                    name="defaultValues"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:default_checked")}</FormLabel>
                        <FormControl>
                          <TagInput
                            tags={checkboxCheckedValues}
                            onAddition={(item) => {
                              setCheckboxCheckedValues((prevValues) => {
                                const newValues = [...prevValues, item]
                                form.setValue("defaultValues", newValues)
                                return newValues
                              })
                            }}
                            onDelete={(idx) => {
                              setCheckboxCheckedValues((prevValues) => {
                                const newValues = prevValues.filter(
                                  (item, index) => index !== idx
                                )
                                form.setValue("defaultValues", newValues)
                                return newValues
                              })
                            }}
                            placeholder={`${t(
                              "common:entity_comma_separated_default_checked_placeholder",
                              {
                                entity: t("common:checkbox")
                              }
                            )} (${t("common:optional")})`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </>
              )}
              {type === "RADIO" && (
                <>
                  <FormItem>
                    <FormLabel>
                      {t("common:entity_options", {
                        entity: t("common:radio")
                      })}
                    </FormLabel>
                    <FormControl>
                      <TagInput
                        tags={values}
                        onAddition={(item) => {
                          setValues((prevValues) => {
                            const newValues = [...prevValues, item]
                            return newValues
                          })
                        }}
                        onDelete={(idx) => {
                          setValues((prevValues) => {
                            const newValues = prevValues.filter(
                              (item, index) => index !== idx
                            )
                            return newValues
                          })
                        }}
                        placeholder={t(
                          "common:entity_comma_separated_options_placeholder",
                          {
                            entity: t("common:radio")
                          }
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  {/* <FormField
                    control={form.control}
                    name="radioDefaultOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:default_value")}</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`${t(
                                    "common:select_default_entity_value_placeholder",
                                    {
                                      entity: t("common:radio")
                                    }
                                  )} (${t("common:optional")})`}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.keys(attributeTypes).map((type) => (
                                <SelectItem
                                  value={attributeTypes[type]}
                                  key={type}
                                >
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </>
              )}
              {type === "SELECT" && (
                <>
                  <FormItem>
                    <FormLabel>
                      {t("common:entity_options", {
                        entity: t("common:select_box")
                      })}
                    </FormLabel>
                    <FormControl>
                      <TagInput
                        tags={values}
                        onAddition={(item) => {
                          setValues((prevValues) => {
                            const newValues = [...prevValues, item]
                            return newValues
                          })
                        }}
                        onDelete={(idx) => {
                          setValues((prevValues) => {
                            const newValues = prevValues.filter(
                              (item, index) => index !== idx
                            )
                            return newValues
                          })
                        }}
                        placeholder={t(
                          "common:entity_comma_separated_options_placeholder",
                          {
                            entity: t("common:select_box")
                          }
                        )}
                      />
                    </FormControl>
                  </FormItem>
                  {/* <FormField
                    control={form.control}
                    name="selectDefaultOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common:default_value")}</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`${t(
                                    "common:select_default_entity_value_placeholder",
                                    {
                                      entity: t("common:select_box")
                                    }
                                  )} (${t("common:optional")})`}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.keys(attributeTypes).map((type) => (
                                <SelectItem
                                  value={attributeTypes[type]}
                                  key={type}
                                >
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </>
              )}
              {type === "TEXT" && (
                <></>
                // <FormField
                //   control={form.control}
                //   name="values"
                //   render={({ field }) => (
                //     <FormItem>
                //       <FormLabel>{t("common:default_text")}</FormLabel>
                //       <FormControl>
                //         <Input {...field} placeholder={t("common:optional")} />
                //       </FormControl>
                //       <FormMessage />
                //     </FormItem>
                //   )}
                // />
              )}
              {type === "TEXTAREA" && (
                <></>
                // <FormField
                //   control={form.control}
                //   name="values"
                //   render={({ field }) => (
                //     <FormItem>
                //       <FormLabel>{t("common:default_text")}</FormLabel>
                //       <FormControl>
                //         <Textarea
                //           {...field}
                //           placeholder={t("common:optional")}
                //         />
                //       </FormControl>
                //       <FormMessage />
                //     </FormItem>
                //   )}
                // />
              )}
            </div>
          )}

          <div className="flex flex-col gap-4">
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
            <FormField
              control={form.control}
              name="isFilterable"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel noStyle>{t("common:filterable")}</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel noStyle>{t("common:required")}</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {attribute && (
          <div className="mt-12">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-bold text-alpha-800">
                {t("common:categories")}
              </h2>
            </div>
            <FormItem className="mb-8">
              <FormLabel>{t("common:category")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={categories.isLoading || categories.isError}
                      noStyle
                      role="combobox"
                      className="input-field flex items-center text-start"
                    >
                      {t("common:choose_entity", {
                        entity: t("common:category")
                      })}
                      <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="z-[99999]" hideWhenDetached={true}>
                  <Command>
                    <CommandInput
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
                                setSelectedCategories((prevValues) => {
                                  return [
                                    ...prevValues,
                                    categories.data?.allCategoriesV2.find(
                                      (item) =>
                                        item &&
                                        item.title.toLowerCase() === value
                                    ) as Category
                                  ]
                                })
                              }}
                            >
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

            {!categoryId && selectedCategories && (
              <div className="card table-responsive rounded">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t("common:title")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCategories.map(
                      (category) =>
                        category && (
                          <tr key={category.id}>
                            <td>{category.title}</td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </form>
    </Form>
  )
}

export default AttributeForm
