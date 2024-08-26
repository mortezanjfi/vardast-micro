"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import Dropzone from "@vardast/component/Dropzone"
import { SellerModalEnum } from "@vardast/component/type"
import {
  CreateSellerInput,
  CreateSellerInputSchema,
  ThreeStateSupervisionStatuses,
  useCreateSellerMutation,
  useUpdateSellerMutation
} from "@vardast/graphql/generated"
import { ThreeStateSupervisionStatusesFa } from "@vardast/lib/constants"
import { uploadPaths } from "@vardast/lib/uploadPaths"
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

type SellerModalType = Omit<CreateSellerInput, "logoFileUuid"> & {
  id?: number
}

z.setErrorMap(zodI18nMap)

const SellerModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<SellerModalEnum, SellerModalType>) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()

  const isEdit = modals?.data?.id

  const createSellerSchema = CreateSellerInputSchema().merge(
    z.object({
      logoFileUuid: z.string().optional()
    })
  )

  const form = useForm<CreateSellerInput>({
    resolver: zodResolver(createSellerSchema)
  })

  const createSellerMutation = useCreateSellerMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createSeller?.id) {
          router.push(`/users/seller/${data.createSeller.id}`)
        }
      }
    }
  )

  const updateSellerMutation = useUpdateSellerMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.updateSeller?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  function onSubmit(data: SellerModalType) {
    const body = {
      ...data
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateSellerMutation.mutate({
        updateSellerInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createSellerMutation.mutate({
        createSellerInput: body
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
      ? t("common:edit_entity", { entity: t("common:seller") })
      : t("common:new_entity", { entity: t("common:seller") }),
    action: {
      title: t("common:save_entity", { entity: t("common:seller") }),
      loading: createSellerMutation.isLoading || updateSellerMutation.isLoading,
      disabled: createSellerMutation.isLoading || updateSellerMutation.isLoading
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
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{t("common:bio")}</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="logoFileUuid"
        render={() => (
          <FormItem className="col-span-full">
            <FormLabel>{t("common:logo")}</FormLabel>
            <FormControl className="mx-auto">
              <Dropzone
                existingImages={undefined}
                maxFiles={1}
                uploadPath={uploadPaths.sellerLogo}
                withHeight={false}
                onAddition={(file) => {
                  form.setValue("logoFileUuid", file.uuid)
                }}
                onDelete={() => {
                  form.setValue("logoFileUuid", "")
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

export default SellerModal
