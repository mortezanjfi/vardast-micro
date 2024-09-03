"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductModalEnum } from "@vardast/component/type"
import {
  CreateOfferInput,
  CreateOfferInputSchema,
  ThreeStateSupervisionStatuses,
  useCreateOfferMutation,
  useGetAllProductsWithoutPaginationQuery,
  useGetSellersWithoutPaginationQuery,
  useUpdateOfferMutation
} from "@vardast/graphql/generated"
import { ThreeStateSupervisionStatusesFa } from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { SelectPopover } from "@vardast/ui/select-popover"
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

type OfferModalType = CreateOfferInput & {
  id?: number
}

z.setErrorMap(zodI18nMap)

const OfferModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<ProductModalEnum, OfferModalType>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const [sellerSearch, setSellerSearch] = useState("")

  const isEdit = modals?.data?.id

  const createOfferSchema = CreateOfferInputSchema()

  const form = useForm<CreateOfferInput>({
    resolver: zodResolver(createOfferSchema)
  })

  const getSellersWithoutPaginationQuery = useGetSellersWithoutPaginationQuery(
    graphqlRequestClientWithToken,
    {
      indexSellerInput: {
        status: ThreeStateSupervisionStatuses.Confirmed,
        name: sellerSearch
      }
    },
    { enabled: open }
  )
  const getAllProductsWithoutPaginationQuery =
    useGetAllProductsWithoutPaginationQuery(
      graphqlRequestClientWithToken,
      {},
      { enabled: open }
    )

  const createOfferMutation = useCreateOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createOffer?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  const updateOfferMutation = useUpdateOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.updateOffer?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  function onSubmit(data: OfferModalType) {
    const body = {
      ...data
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateOfferMutation.mutate({
        updateOfferInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createOfferMutation.mutate({
        createOfferInput: body
      })
    }
  }

  useEffect(() => {
    if (isEdit) {
      setMultiFormValues(modals?.data, form.setValue)
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
      ? t("common:edit_entity", { entity: t("common:offer") })
      : t("common:new_entity", { entity: t("common:offer") }),
    action: {
      title: t("common:save"),
      loading: createOfferMutation.isLoading || updateOfferMutation.isLoading,
      disabled: createOfferMutation.isLoading || updateOfferMutation.isLoading
    },
    form: {
      formProps: form,
      onSubmit: form.handleSubmit(onSubmit)
    }
  }

  return (
    <Modal {...modalProps}>
      <FormField
        control={form.control}
        name="productId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:uom")}</FormLabel>
            <FormControl>
              <SelectPopover
                options={getAllProductsWithoutPaginationQuery.data?.productsWithoutPagination?.map(
                  (product) => ({
                    key: product?.name,
                    value: `${product?.id}`
                  })
                )}
                internalSearchable
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue("productId", +value, {
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
        name="sellerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:uom")}</FormLabel>
            <FormControl>
              <SelectPopover
                options={getSellersWithoutPaginationQuery.data?.sellersWithoutPagination?.map(
                  (product) => ({
                    key: product?.name,
                    value: `${product?.id}`
                  })
                )}
                setSearch={setSellerSearch}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue("sellerId", +value, {
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
        name="isPublic"
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
                  form.setValue("isPublic", value === "true", {
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
        name="isAvailable"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:is_available")}</FormLabel>
            <FormControl>
              <SelectPopover
                options={[
                  {
                    key: t("common:available"),
                    value: "true"
                  },
                  {
                    key: t("common:unavailable"),
                    value: "false"
                  }
                ]}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue("isAvailable", value === "true", {
                    shouldDirty: true
                  })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Modal>
  )
}

export default OfferModal
