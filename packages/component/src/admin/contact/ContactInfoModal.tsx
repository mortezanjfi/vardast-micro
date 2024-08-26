"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import {
  ContactInfoTypes,
  CreateContactInfoInput,
  CreateContactInfoInputSchema,
  ThreeStateSupervisionStatuses,
  useCreateContactInfoMutation,
  useUpdateContactInfoMutation
} from "@vardast/graphql/generated"
import {
  ContactInfoTypesFa,
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
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import {
  cellphoneNumberSchema,
  phoneSchema
} from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

type ContactInfoFormDataType = Omit<CreateContactInfoInput, "sort"> & {
  sort: string
}

const createContactInfoSchema = CreateContactInfoInputSchema()
  .omit({ sort: true })
  .merge(
    z.object({
      sort: z.string()
    })
  )
  .superRefine((data, ctx) => {
    const { type, number } = data

    let schemaToUse: z.ZodType<any, any, any>
    let validationResult: z.SafeParseReturnType<any, any>

    if (type === ContactInfoTypes.Mobile) {
      schemaToUse = cellphoneNumberSchema
    } else {
      schemaToUse = phoneSchema
    }

    validationResult = schemaToUse.safeParse(number)

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ["number"]
        })
      })
    }
  })

const ContactInfoModal = <TEnum,>({
  modals,
  open,
  onCloseModals
}: IUseModal<TEnum, ContactInfoFormDataType & { id?: number }>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()

  const isEdit = modals?.data?.number

  const createContactInfoMutation = useCreateContactInfoMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createContactInfo?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  const updateContactInfoMutation = useUpdateContactInfoMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.updateContactInfo?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  z.setErrorMap(zodI18nMap)

  const form = useForm<ContactInfoFormDataType>({
    resolver: zodResolver(createContactInfoSchema)
  })

  function onSubmit(data: ContactInfoFormDataType) {
    const body = {
      ...data,
      number: data?.number ? digitsFaToEn(data?.number) : undefined,
      sort: data?.sort ? +digitsFaToEn(`${data?.sort}`) : undefined
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateContactInfoMutation.mutate({
        updateContactInfoInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createContactInfoMutation.mutate({
        createContactInfoInput: body
      })
    }
  }

  useEffect(() => {
    if (isEdit) {
      const { number, sort } = modals?.data
      setMultiFormValues(
        {
          ...modals.data,
          number: number ? digitsEnToFa(number) : undefined,
          sort: sort ? digitsEnToFa(sort) : undefined
        },
        form.setValue
      )
    } else {
      const modalData = modals?.data
      if (modalData) {
        setMultiFormValues(
          {
            relatedId: modalData?.relatedId,
            relatedType: modalData?.relatedType
          },
          form.setValue
        )
      }
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
      ? t("common:edit_entity", { entity: t("common:contactInfo") })
      : t("common:new_entity", { entity: t("common:contactInfo") }),
    action: {
      title: t("common:save_entity", { entity: t("common:contactInfo") }),
      loading:
        createContactInfoMutation.isLoading ||
        updateContactInfoMutation.isLoading,
      disabled:
        createContactInfoMutation.isLoading ||
        updateContactInfoMutation.isLoading
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
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:type")}</FormLabel>
            <FormControl>
              <SelectPopover
                options={Object.entries(
                  enumToKeyValueObject(ContactInfoTypes)
                )?.map(([value, key]) => ({
                  key: ContactInfoTypesFa[key as ContactInfoTypes]?.name_fa,
                  value: value.toUpperCase()
                }))}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue(
                    "type",
                    value.toUpperCase() as ContactInfoTypes,
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
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:number")}</FormLabel>
            <FormControl>
              <Input
                className="placeholder:text-right"
                inputMode="numeric"
                placeholder={digitsEnToFa("09*********")}
                type="tel"
                {...field}
                onChange={(e) => {
                  e.target.value.length <= 11 &&
                    field.onChange(digitsEnToFa(e.target.value))
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
        name="sort"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:display_sort")}</FormLabel>
            <FormControl>
              <Input
                className="placeholder:text-right"
                inputMode="numeric"
                placeholder={t("common:enter")}
                type="tel"
                {...field}
                onChange={(e) => {
                  field.onChange(digitsEnToFa(e.target.value))
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
    </Modal>
  )
}

export default ContactInfoModal
