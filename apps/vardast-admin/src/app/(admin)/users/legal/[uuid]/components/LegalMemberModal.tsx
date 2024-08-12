import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import { LegalModalEnum } from "@vardast/component/type"
import {
  CreateMemberInput,
  CreateMemberInputSchema,
  MemberRoles,
  useCreateMemberMutation,
  useUpdateMemberMutation
} from "@vardast/graphql/generated"
import { MemberRolesFa } from "@vardast/lib/constants"
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
import { cellphoneNumberSchema } from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const createLegalUserSchema = CreateMemberInputSchema()
  .omit({ typeMember: true })
  .merge(
    z.object({
      cellphone: cellphoneNumberSchema
    })
  )

const LegalMemberModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<LegalModalEnum, CreateMemberInput & { id?: number }>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()

  const isEdit = modals?.data?.id

  const form = useForm<CreateMemberInput>({
    resolver: zodResolver(createLegalUserSchema)
  })

  const createMemberMutation = useCreateMemberMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createMember) {
          onCloseModals(data)
        }
      }
    }
  )

  const updateMemberMutation = useUpdateMemberMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.updateMember?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  const onSubmit = (data: CreateMemberInput) => {
    let body = {
      ...data,
      cellphone: data?.cellphone ? digitsFaToEn(data?.cellphone) : undefined
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateMemberMutation.mutate({
        updateMemberInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createMemberMutation.mutate({
        createMemberInput: body
      })
    }
  }

  useEffect(() => {
    if (isEdit) {
      const { cellphone } = modals?.data
      setMultiFormValues(
        {
          ...modals.data,
          cellphone: cellphone ? digitsEnToFa(cellphone) : undefined
        },
        form.setValue
      )
    } else {
      const modalData = modals?.data
      if (modalData) {
        setMultiFormValues(
          {
            relatedId: modalData?.relatedId
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
      ? t("common:edit_entity", { entity: t("common:user") })
      : t("common:new_entity", { entity: t("common:user") }),
    action: {
      title: t("common:save_entity", { entity: t("common:colleague") }),
      loading: createMemberMutation.isLoading || updateMemberMutation.isLoading,
      disabled: createMemberMutation.isLoading || updateMemberMutation.isLoading
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
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_name", {
                entity: t("common:position")
              })}
              *
            </FormLabel>
            <FormControl>
              <Input {...field} type="text" placeholder={t("common:enter")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cellphone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:cellphone")} ({t("common:manager")} )
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                className="placeholder:text-right"
                placeholder={digitsEnToFa("09*********")}
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
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:role")}</FormLabel>
            <FormControl>
              <SelectPopover
                onSelect={(value) => {
                  form.setValue("role", value.toUpperCase() as MemberRoles, {
                    shouldDirty: true
                  })
                }}
                options={Object.entries(enumToKeyValueObject(MemberRoles))?.map(
                  ([value, key]) => ({
                    key: MemberRolesFa[key as MemberRoles]?.name_fa,
                    value: value.toUpperCase()
                  })
                )}
                value={`${field.value}`}
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
                onSelect={(value) => {
                  form.setValue("isActive", value === "true", {
                    shouldDirty: true
                  })
                }}
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Modal>
  )
}
export default LegalMemberModal
