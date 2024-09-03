"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductModalEnum } from "@vardast/component/type"
import {
  Brand,
  Category,
  CreateProductInput,
  CreateProductInputSchema,
  Image,
  ProductTypesEnum,
  ThreeStateSupervisionStatuses,
  useCreateProductMutation,
  useGetAllBrandsWithoutPaginationQuery,
  useGetAllCategoriesV2Query,
  useGetAllUomsWithoutPaginationQuery,
  useUpdateProductMutation
} from "@vardast/graphql/generated"
import {
  ProductTypesEnumFa,
  ThreeStateSupervisionStatusesFa
} from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { SelectPopover } from "@vardast/ui/select-popover"
import { Textarea } from "@vardast/ui/textarea"
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

type ProductModalType = CreateProductInput & {
  id?: number
  brand?: Brand
  category?: Category
  images?: Image[]
}

z.setErrorMap(zodI18nMap)

const ProductModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<ProductModalEnum, ProductModalType>) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()
  const [brandSearch, setBrandSearch] = useState("")
  const [categorySearch, setCategorySearch] = useState("")

  const isEdit = modals?.data?.id

  const createProductSchema = CreateProductInputSchema()

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema)
  })

  const createProductMutation = useCreateProductMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createProduct?.id) {
          router.push(`/products/${data.createProduct.id}`)
        }
      }
    }
  )
  const updateProductMutation = useUpdateProductMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.updateProduct?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  const getAllCategoriesV2Query = useGetAllCategoriesV2Query(
    graphqlRequestClientWithToken,
    {
      indexCategoryInput: {
        name: categorySearch
      }
    },
    {
      enabled: open,
      select: (data) => {
        const existCurrentBrand =
          modals?.data?.category?.id &&
          data.allCategoriesV2?.find(
            (item) => item?.id === modals?.data?.category?.id
          )
        if (isEdit && !existCurrentBrand) {
          return {
            ...data,
            categorysWithoutPagination: [
              ...data?.allCategoriesV2,
              modals.data.category
            ]
          }
        }
        return data
      }
    }
  )

  const getAllBrandsWithoutPaginationQuery =
    useGetAllBrandsWithoutPaginationQuery(
      graphqlRequestClientWithToken,
      {
        indexBrandInput: {
          perPage: 10,
          name: brandSearch
        }
      },
      {
        enabled: open
      }
    )

  const categoriesList = useMemo(() => {
    const existCurrentCategory =
      modals?.data?.category?.id &&
      getAllCategoriesV2Query.data?.allCategoriesV2?.find(
        (item) => item?.id === modals?.data?.category?.id
      )
    if (
      isEdit &&
      !existCurrentCategory &&
      getAllCategoriesV2Query.data?.allCategoriesV2
    ) {
      return [
        ...getAllCategoriesV2Query.data?.allCategoriesV2,
        modals.data.category
      ]
    }
    return getAllCategoriesV2Query.data?.allCategoriesV2
  }, [getAllCategoriesV2Query, modals?.data])

  const brandsList = useMemo(() => {
    const existCurrentBrand =
      modals?.data?.brand?.id &&
      getAllBrandsWithoutPaginationQuery.data?.brandsWithoutPagination?.find(
        (item) => item?.id === modals?.data?.brand?.id
      )
    if (
      isEdit &&
      !existCurrentBrand &&
      getAllBrandsWithoutPaginationQuery.data?.brandsWithoutPagination
    ) {
      return [
        ...getAllBrandsWithoutPaginationQuery.data?.brandsWithoutPagination,
        modals.data.brand
      ]
    }
    return getAllBrandsWithoutPaginationQuery.data?.brandsWithoutPagination
  }, [getAllBrandsWithoutPaginationQuery, modals?.data])

  const getAllUomsWithoutPaginationQuery = useGetAllUomsWithoutPaginationQuery(
    graphqlRequestClientWithToken,
    {},
    { enabled: open }
  )

  const onSubmit = (data: ProductModalType) => {
    const body = {
      ...data
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateProductMutation.mutate({
        updateProductInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createProductMutation.mutate({
        createProductInput: body
      })
    }
  }

  useEffect(() => {
    if (isEdit) {
      setMultiFormValues(
        {
          ...modals?.data,
          brandId: modals?.data?.brand?.id,
          categoryId: modals?.data?.category?.id
        },
        form.setValue
      )
    }
    return () => {
      form.reset()
      setErrors(undefined)
    }
  }, [modals?.data])

  const modalProps: ModalProps = {
    open,
    onOpenChange: onCloseModals,
    errors,
    title: isEdit
      ? t("common:edit_entity", { entity: t("common:product") })
      : t("common:new_entity", { entity: t("common:product") }),
    action: {
      title: t("common:save"),
      loading:
        createProductMutation.isLoading || updateProductMutation.isLoading,
      disabled:
        createProductMutation.isLoading || updateProductMutation.isLoading
    },
    form: {
      formProps: form,
      onSubmit: form.handleSubmit(onSubmit)
    }
  }

  return (
    <>
      <Modal {...modalProps}>
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
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:brand")}</FormLabel>
              <FormControl>
                <SelectPopover
                  options={brandsList?.map((brand) => ({
                    key: brand?.name,
                    value: `${brand?.id}`
                  }))}
                  setSearch={setBrandSearch}
                  value={`${field.value}`}
                  onSelect={(value) => {
                    form.setValue("brandId", +value, {
                      shouldDirty: true
                    })
                  }}
                />
              </FormControl>
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
              <FormControl>
                <SelectPopover
                  options={categoriesList?.map((category) => ({
                    key: category?.title,
                    value: `${category?.id}`
                  }))}
                  setSearch={setCategorySearch}
                  value={`${field.value}`}
                  onSelect={(value) => {
                    form.setValue("categoryId", +value, {
                      shouldDirty: true
                    })
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="uomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:uom")}</FormLabel>
              <FormControl>
                <SelectPopover
                  options={getAllUomsWithoutPaginationQuery.data?.uomsWithoutPagination?.map(
                    (uom) => ({
                      key: uom?.name,
                      value: `${uom?.id}`
                    })
                  )}
                  value={`${field.value}`}
                  onSelect={(value) => {
                    form.setValue("uomId", +value, {
                      shouldDirty: true
                    })
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:product_sku")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("common:enter_product_sku")} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>{t("common:description")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:page_title")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>{t("common:meta_description")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
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
              <FormControl>
                <SelectPopover
                  options={Object.entries(
                    enumToKeyValueObject(ThreeStateSupervisionStatuses)
                  )?.map(([value, key]) => ({
                    key: ThreeStateSupervisionStatusesFa[
                      key as ThreeStateSupervisionStatuses
                    ]?.name_fa,
                    value: value.toUpperCase()
                  }))}
                  value={`${field.value}`}
                  onSelect={(value) => {
                    form.setValue(
                      "status",
                      value.toUpperCase() as ThreeStateSupervisionStatuses,
                      {
                        shouldDirty: true
                      }
                    )
                  }}
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
              <FormLabel>{t("common:visibility")}</FormLabel>
              <FormControl>
                <SelectPopover
                  options={[
                    {
                      key: t("common:active"),
                      value: "true"
                    },
                    {
                      key: t("common:inactive"),
                      value: "false"
                    }
                  ]}
                  value={`${field.value}`}
                  onSelect={(value) => {
                    form.setValue("isActive", value === "true", {
                      shouldDirty: true
                    })
                  }}
                />
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
              <FormLabel>{t("common:product_type")}</FormLabel>
              <FormControl>
                <SelectPopover
                  options={Object.entries(
                    enumToKeyValueObject(ProductTypesEnum)
                  )?.map(([value, key]) => ({
                    key: ProductTypesEnumFa[key as ProductTypesEnum]?.name_fa,
                    value: value.toUpperCase()
                  }))}
                  value={`${field.value}`}
                  onSelect={(value) => {
                    form.setValue(
                      "type",
                      value.toUpperCase() as ProductTypesEnum,
                      {
                        shouldDirty: true
                      }
                    )
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Modal>
    </>
  )
}

export default ProductModal
