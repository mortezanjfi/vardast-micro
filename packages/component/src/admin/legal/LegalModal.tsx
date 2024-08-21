import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import {
  CreateLegalInput,
  CreateLegalInputSchema,
  LegalStatusEnum,
  useCreateLegalMutation,
  useUpdateLegalMutation
} from "@vardast/graphql/generated"
import { LegalStatusEnumFa } from "@vardast/lib/constants"
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
import {
  accountNumberSchema,
  cellphoneNumberSchema,
  nationalIdNumberSchema,
  shebaSchema
} from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { LegalModalEnum } from "../../type"

const isAdmin = process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "admin"

const LegalModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<LegalModalEnum, CreateLegalInput & { id?: number }>) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()

  const isEdit = modals?.data?.id

  const createLegalUserSchema = CreateLegalInputSchema()
    .merge(
      z.object({
        cellphone: cellphoneNumberSchema,
        shabaNumber: shebaSchema,
        accountNumber: accountNumberSchema,
        national_id: nationalIdNumberSchema
      })
    )
    .omit(
      !isAdmin && {
        status: true,
        wallet: true
      }
    )

  const form = useForm<CreateLegalInput>({
    resolver: zodResolver(createLegalUserSchema)
  })

  const createLegalMutation = useCreateLegalMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createLegal?.id) {
          onCloseModals(data)
          router.push(`/users/legal/${data.createLegal.id}`)
        }
      }
    }
  )

  const updateLegalMutation = useUpdateLegalMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.updateLegal?.id) {
          onCloseModals(data)
        }
      }
    }
  )

  const onSubmit = (data: CreateLegalInput) => {
    let body = {
      ...data,
      cellphone: data?.cellphone ? digitsFaToEn(data?.cellphone) : undefined,
      national_id: data?.national_id
        ? digitsFaToEn(data?.national_id)
        : undefined,
      accountNumber: data?.accountNumber
        ? digitsFaToEn(data?.accountNumber)
        : undefined,
      wallet: data?.wallet ? digitsFaToEn(data?.wallet) : undefined,
      shabaNumber: data?.shabaNumber
        ? digitsFaToEn(data?.shabaNumber)
        : undefined
    }

    if (!isAdmin) {
      delete body.status
      delete body.wallet
      body.cellphone = data?.cellphone
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateLegalMutation.mutate({
        updateLegalInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createLegalMutation.mutate({
        createLegalInput: body
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
          national_id: modals?.data?.national_id
            ? digitsEnToFa(modals?.data?.national_id)
            : undefined,
          accountNumber: modals?.data?.accountNumber
            ? digitsEnToFa(modals?.data?.accountNumber)
            : undefined,
          wallet: modals?.data?.wallet
            ? digitsEnToFa(modals?.data?.wallet)
            : undefined,
          shabaNumber: modals?.data?.shabaNumber
            ? digitsEnToFa(modals?.data?.shabaNumber)
            : undefined
        },
        form.setValue
      )
    } else if (!isAdmin) {
      setMultiFormValues(
        {
          cellphone: modals?.data?.cellphone
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
    title: isEdit ? t("common:edit") : t("common:new"),
    action: {
      title: t("common:save"),
      loading: createLegalMutation.isLoading || updateLegalMutation.isLoading,
      disabled: createLegalMutation.isLoading || updateLegalMutation.isLoading
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
        name="name_company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_name", {
                entity: t("common:company")
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
        name="national_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_uuid", {
                entity: t("common:national")
              })}
              *
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                className="placeholder:text-right"
                placeholder={t("common:enter")}
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
        name="accountNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_number", {
                entity: t("common:account")
              })}
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                className="placeholder:text-right"
                placeholder={t("common:enter")}
                {...field}
                onChange={(e) => {
                  e.target.value.length <= 18 &&
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
        name="shabaNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_number", {
                entity: t("common:shaba")
              })}
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                className="placeholder:text-right"
                placeholder={t("common:enter")}
                {...field}
                onChange={(e) => {
                  e.target.value.length <= 24 &&
                    field.onChange(digitsEnToFa(e.target.value))
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isAdmin && (
        <>
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
            name="wallet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`${t("common:wallet")} (${t("common:toman")})`}</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    className="placeholder:text-right"
                    placeholder={t("common:enter")}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:status")}</FormLabel>
                <FormControl>
                  <SelectPopover
                    onSelect={(value) => {
                      form.setValue(
                        "status",
                        value.toUpperCase() as LegalStatusEnum,
                        {
                          shouldDirty: true
                        }
                      )
                    }}
                    options={Object.entries(
                      enumToKeyValueObject(LegalStatusEnum)
                    )?.map(([value, key]) => ({
                      key: LegalStatusEnumFa[key as LegalStatusEnum]?.name_fa,
                      value: value.toUpperCase()
                    }))}
                    value={`${field.value}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </Modal>
  )
}
export default LegalModal
