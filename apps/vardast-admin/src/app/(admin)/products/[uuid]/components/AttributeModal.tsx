"use client"

import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProductModalEnum } from "@vardast/component/type"
import {
  AttributeTypesEnum,
  CreateAttributeValueInput,
  CreateAttributeValueInputSchema,
  useCreateAttributeValueMutation,
  useGetAttributesOfACategoryQuery,
  useUpdateAttributeValueMutation
} from "@vardast/graphql/generated"
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
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

type AttributeValueType = CreateAttributeValueInput & {
  id?: number
  categoryId: number
}

z.setErrorMap(zodI18nMap)

const AttributeModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<ProductModalEnum, AttributeValueType>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()

  const isEdit = modals?.data?.id

  const createAttributeValueSchema = CreateAttributeValueInputSchema().refine(
    (schema) => (schema.isVariant ? !!schema.sku : true),
    {
      path: ["sku"],
      message: t("zod:errors.invalid_type_received_undefined")
    }
  )

  const form = useForm<CreateAttributeValueInput>({
    resolver: zodResolver(createAttributeValueSchema)
  })

  const getAttributesOfACategoryQuery = useGetAttributesOfACategoryQuery(
    graphqlRequestClientWithToken,
    {
      id: modals?.data?.categoryId
    },
    { enabled: open }
  )
  const createAttributeValueMutation = useCreateAttributeValueMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createAttributeValue?.id) {
          onCloseModals(data?.createAttributeValue?.id)
        }
      }
    }
  )
  const updateAttributeValueMutation = useUpdateAttributeValueMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.updateAttributeValue?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  function onSubmit(data: CreateAttributeValueInput) {
    const body = {
      ...data
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateAttributeValueMutation.mutate({
        updateAttributeValueInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createAttributeValueMutation.mutate({
        createAttributeValueInput: body
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

  const selectedAttributes = useMemo(
    () =>
      getAttributesOfACategoryQuery.data?.categoryAttribuite?.attributes?.find(
        (item) => item.id === form.watch("attributeId")
      ),
    [getAttributesOfACategoryQuery, form.watch("attributeId")]
  )

  const modalProps: ModalProps = {
    open,
    onOpenChange: onCloseModals,
    errors,
    title: isEdit
      ? t("common:edit_entity", { entity: t("common:attribute") })
      : t("common:new_entity", { entity: t("common:attribute") }),
    action: {
      title: t("common:save"),
      loading:
        createAttributeValueMutation.isLoading ||
        updateAttributeValueMutation.isLoading,
      disabled:
        createAttributeValueMutation.isLoading ||
        updateAttributeValueMutation.isLoading
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
        name="attributeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:attribute")}</FormLabel>
            <FormControl>
              <SelectPopover
                options={getAttributesOfACategoryQuery.data?.categoryAttribuite.attributes?.map(
                  (uom) => ({
                    key: uom?.name,
                    value: `${uom?.id}`
                  })
                )}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue("attributeId", +value, {
                    shouldDirty: true
                  })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {form.watch("attributeId") && (
        <>
          {selectedAttributes?.type === AttributeTypesEnum.Text && (
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:value")}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {selectedAttributes?.type === AttributeTypesEnum.Select && (
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common:value")}</FormLabel>
                  <FormControl>
                    <SelectPopover
                      options={selectedAttributes?.values?.options?.map(
                        (attr: string) => ({
                          key: attr,
                          value: attr
                        })
                      )}
                      value={`${field.value}`}
                      onSelect={(value) => {
                        form.setValue("value", value, {
                          shouldDirty: true
                        })
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </>
      )}

      <FormField
        control={form.control}
        name="isVariant"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:visibility")}</FormLabel>
            <FormControl>
              <SelectPopover
                options={[
                  {
                    key: "نمایش",
                    value: "true"
                  },
                  {
                    key: "عدم نمایش",
                    value: "false"
                  }
                ]}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue("isVariant", value === "true", {
                    shouldDirty: true
                  })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {form.watch("isVariant") === true && (
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:product_sku")}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </Modal>
  )
}

export default AttributeModal
