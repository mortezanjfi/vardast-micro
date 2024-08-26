"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebouncedState } from "@mantine/hooks"
import { useQueryClient } from "@tanstack/react-query"
import Dropzone from "@vardast/component/Dropzone"
import {
  Image,
  useCreateCategoryMutation,
  useGetAllCategoriesV2Query,
  useUpdateCategoryMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
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
import { Switch } from "@vardast/ui/switch"
import { Textarea } from "@vardast/ui/textarea"
import { slugify } from "@vardast/util/slugify"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import {
  // LucideAlertOctagon,
  LucideCheck,
  LucideChevronsUpDown
} from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

// import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import {
  CategoryActionModalState,
  CategoryModalEnumType,
  OnOpenCategoryChangeProps
} from "@/app/(admin)/vocabularies/components/Categories"

export type CategoryFormModalProps = {
  modalsOpen: CategoryActionModalState
  onOpenChange: (_: OnOpenCategoryChangeProps) => void
  actionType: "edit" | "create"
}

const CategoryFormModal = ({
  onOpenChange,
  modalsOpen,
  actionType
}: CategoryFormModalProps) => {
  const { t } = useTranslation()
  const [categoryQuery, setCategoryQuery] = useDebouncedState("", 500)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [categoryQueryTemp, setCategoryQueryTemp] = useState("")
  // const [errors, setErrors] = useState<ClientError>()
  const [images, setImages] = useState<
    { uuid: string; expiresAt: string; image?: Image }[]
  >([])

  const queryClient = useQueryClient()

  const allCategoriesQuery = useGetAllCategoriesV2Query(
    graphqlRequestClientWithToken,
    {
      indexCategoryInput: {
        name: categoryQuery
      }
    },
    {
      onSuccess: () => {
        if (modalsOpen?.category) {
          form.setValue(
            "parentCategoryId",
            modalsOpen?.category.parentCategory?.id
          )
        }
      }
    }
  )

  const createCategoryMutation = useCreateCategoryMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        form.reset()
        queryClient.invalidateQueries({
          queryKey: ["GetVocabulary", "admin-category-create"]
        })
        onOpenClose()
        toast({
          description: t("common:entity_added_successfully", {
            entity: t("common:category")
          }),
          duration: 2000,
          variant: "success"
        })
      },
      onError: (errors: ClientError) => {
        toast({
          description: (
            errors.response.errors?.at(0)?.extensions.displayErrors as string[]
          ).map((error) => error),
          duration: 5000,
          variant: "danger"
        })
        // setErrors(errors)
      }
    }
  )
  const updateCategoryMutation = useUpdateCategoryMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        form.reset()
        queryClient.invalidateQueries({
          queryKey: ["GetVocabulary", "admin-category-create"]
        })
        queryClient.invalidateQueries({
          queryKey: [
            "GetCategory",
            "admin-category-card",
            modalsOpen?.category?.id
          ]
        })
        onOpenClose()
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:category")
          }),
          duration: 2000,
          variant: "success"
        })
      },
      onError: (errors: ClientError) => {
        toast({
          description: (
            errors.response.errors?.at(0)?.extensions.displayErrors as string[]
          ).map((error) => error),
          duration: 5000,
          variant: "danger"
        })
        // setErrors(errors)
      }
    }
  )

  z.setErrorMap(zodI18nMap)
  const CreateCategorySchema = z.object({
    parentCategoryId: z.number().optional(),
    title: z.string(),
    titleEn: z.string(),
    description: z.string().optional(),
    slug: z.string(),
    sort: z.number().optional().default(0),
    isActive: z.boolean().optional().default(true)
  })
  type CreateCategory = TypeOf<typeof CreateCategorySchema>

  const form = useForm<CreateCategory>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      sort: 0,
      isActive: true
    }
  })

  const titleEn = form.watch("titleEn")

  useEffect(() => {
    if (titleEn) {
      form.setValue("slug", slugify(titleEn))
    }
    //  else {
    //   form.setValue("slug", "")
    // }
  }, [titleEn, form])

  useEffect(() => {
    if (modalsOpen?.category && actionType === "edit") {
      form.setValue("parentCategoryId", modalsOpen?.category.parentCategory?.id)
      form.setValue("title", modalsOpen?.category.title)
      form.setValue("description", modalsOpen?.category?.description || "")
      form.setValue("titleEn", modalsOpen?.category.titleEn || "")
      form.setValue("slug", modalsOpen?.category.slug || "")
      form.setValue("isActive", modalsOpen?.category.isActive)
      form.setValue("sort", modalsOpen?.category.sort)
    }

    return () => {
      // setErrors(undefined)
      setImages([])
      form.reset()
    }
  }, [modalsOpen?.category, form, actionType])

  const onOpenClose = () => {
    form.reset()
    if (actionType === "edit") {
      onOpenChange({
        type: CategoryModalEnumType.EditCategory,
        currentCategory: modalsOpen.category
      })
    }
    if (actionType === "create") {
      onOpenChange({
        type: CategoryModalEnumType.CreateCategory
      })
    }
  }

  function onSubmit(data: CreateCategory) {
    const {
      title,
      titleEn,
      slug,
      sort,
      parentCategoryId,
      isActive,
      description
    } = data

    if (modalsOpen?.category && actionType === "edit") {
      updateCategoryMutation.mutate({
        updateCategoryInput: {
          id: modalsOpen?.category.id,
          parentCategoryId: parentCategoryId === 0 ? null : parentCategoryId,
          title,
          description,
          titleEn,
          slug,
          sort,
          isActive,
          fileUuid: images[images.length - 1]?.uuid
        }
      })
    } else {
      createCategoryMutation.mutate({
        createCategoryInput: {
          vocabularyId: 1,
          description,
          parentCategoryId,
          title,
          titleEn,
          slug,
          sort,
          isActive,
          fileUuid: images[images.length - 1]?.uuid
        }
      })
    }
  }

  useEffect(() => {
    allCategoriesQuery.refetch()
  }, [categoryQuery])

  return (
    <Dialog
      key={modalsOpen?.category?.id || "create-category"}
      modal={false}
      open={
        actionType === "edit"
          ? modalsOpen[CategoryModalEnumType.EditCategory]
          : modalsOpen[CategoryModalEnumType.CreateCategory]
      }
      onOpenChange={onOpenClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "edit"
              ? t("common:edit_entity", {
                  entity: t("common:category")
                })
              : t("common:create_new_entity", {
                  entity: t("common:category")
                })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 py-8">
              <FormField
                control={form.control}
                name="parentCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:parent_category")}</FormLabel>
                    <Popover
                      open={categoryDialog}
                      onOpenChange={setCategoryDialog}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className="input-field flex items-center text-start"
                            disabled={
                              allCategoriesQuery.isLoading ||
                              allCategoriesQuery.isError
                            }
                            noStyle
                            role="combobox"
                          >
                            {field.value
                              ? allCategoriesQuery.data?.allCategoriesV2.find(
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
                      <PopoverContent className="z-[99999]">
                        <Command>
                          <CommandInput
                            defaultValue={categoryQuery}
                            loading={allCategoriesQuery.isLoading}
                            placeholder={t("common:search_entity", {
                              entity: t("common:category")
                            })}
                            value={categoryQueryTemp}
                            onValueChange={(newQuery) => {
                              setCategoryQuery(newQuery)
                              setCategoryQueryTemp(newQuery)
                            }}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:category")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {allCategoriesQuery.data?.allCategoriesV2.map(
                              (category) =>
                                category && (
                                  <CommandItem
                                    key={category.id}
                                    value={category.title}
                                    onSelect={(value) => {
                                      form.setValue(
                                        "parentCategoryId",
                                        allCategoriesQuery.data?.allCategoriesV2.find(
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
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:english_title")}</FormLabel>
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
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel noStyle>{t("common:is_active")}</FormLabel>
                    </div>
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
                existingImages={
                  actionType === "edit" &&
                  modalsOpen?.category &&
                  modalsOpen?.category.imageCategory
                    ? modalsOpen?.category.imageCategory
                    : undefined
                }
                uploadPath={uploadPaths.productImages}
                onAddition={(file) => {
                  setImages((prevImages) => [
                    ...prevImages,
                    {
                      uuid: file.uuid,
                      expiresAt: file.expiresAt
                    }
                  ])
                }}
                onDelete={(file) => {
                  setImages((images) =>
                    images.filter((image) => image.uuid !== file.uuid)
                  )
                }}
              />
            </div>
            <DialogFooter>
              <div className="flex items-center justify-end gap-2">
                <Button
                  disabled={form.formState.isSubmitting}
                  loading={form.formState.isSubmitting}
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenClose()}
                >
                  {t("common:cancel")}
                </Button>
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {t(actionType === "edit" ? "common:submit" : "common:create")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryFormModal
