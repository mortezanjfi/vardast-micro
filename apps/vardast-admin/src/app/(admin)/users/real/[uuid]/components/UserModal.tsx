"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import { RealModalEnum } from "@vardast/component/type"
import {
  CreateUserInput,
  CreateUserInputSchema,
  useCreateUserMutation,
  UserLanguagesEnum,
  UserStatusesEnum,
  useUpdateUserMutation
} from "@vardast/graphql/generated"
import { UserLanguagesEnumFa, UserStatusesEnumFa } from "@vardast/lib/constants"
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
  nationalCodeNumberSchema
} from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const UserModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<RealModalEnum, CreateUserInput & { id?: number }>) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()

  const isEdit = modals?.data?.id

  const createUserSchema = CreateUserInputSchema().merge(
    z.object({
      cellphone: cellphoneNumberSchema,
      nationalCode: nationalCodeNumberSchema.optional()
    })
  )

  const createUserMutation = useCreateUserMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createUser?.id) {
          router.push(`/users/real/${data.createUser.id}`)
        }
      }
    }
  )
  const updateUserMutation = useUpdateUserMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.updateUser?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  z.setErrorMap(zodI18nMap)

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema)
  })

  const onSubmit = (data: CreateUserInput) => {
    let body = {
      ...data,
      cellphone: data?.cellphone ? digitsFaToEn(data?.cellphone) : undefined,
      nationalCode: data?.nationalCode
        ? digitsFaToEn(data?.nationalCode)
        : undefined
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateUserMutation.mutate({
        updateUserInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createUserMutation.mutate({
        createUserInput: body
      })
    }
  }

  useEffect(() => {
    if (isEdit) {
      setMultiFormValues(
        {
          ...modals.data,
          cellphone: modals?.data?.cellphone
            ? digitsEnToFa(modals?.data?.cellphone)
            : undefined,
          nationalCode: modals?.data?.nationalCode
            ? digitsEnToFa(modals?.data?.nationalCode)
            : undefined
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
      ? t("common:edit_entity", { entity: t("common:user") })
      : t("common:new_entity", { entity: t("common:user") }),
    action: {
      title: t("common:save_entity", { entity: t("common:user") }),
      loading: createUserMutation.isLoading || updateUserMutation.isLoading,
      disabled: createUserMutation.isLoading || updateUserMutation.isLoading
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
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:first_name")}</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:last_name")}</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="nationalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_code", { entity: t("common:national") })}
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                className="placeholder:text-left"
                placeholder={digitsEnToFa("***********")}
                {...field}
                onChange={(e) => {
                  e.target.value.length <= 10 &&
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
                className="placeholder:text-left"
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
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:status")}</FormLabel>
            <FormControl>
              <SelectPopover
                onSelect={(value) => {
                  form.setValue(
                    "status",
                    value.toUpperCase() as UserStatusesEnum,
                    {
                      shouldDirty: true
                    }
                  )
                }}
                options={Object.entries(
                  enumToKeyValueObject(UserStatusesEnum)
                )?.map(([value, key]) => ({
                  key: UserStatusesEnumFa[key as UserStatusesEnum]?.name_fa,
                  value: value.toUpperCase()
                }))}
                value={`${field.value}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:language")}</FormLabel>
            <FormControl>
              <SelectPopover
                onSelect={(value) => {
                  form.setValue(
                    "language",
                    value.toUpperCase() as UserLanguagesEnum,
                    {
                      shouldDirty: true
                    }
                  )
                }}
                options={Object.entries(
                  enumToKeyValueObject(UserLanguagesEnum)
                )?.map(([value, key]) => ({
                  key: UserLanguagesEnumFa[key as UserLanguagesEnum]?.name_fa,
                  value: value.toUpperCase()
                }))}
                value={`${field.value}`}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{t("common:email")}</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isEdit && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:password")}</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </Modal>
  )
}

export default UserModal
