"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import {
  CreateProjectInput,
  CreateProjectInputSchema,
  MultiStatuses,
  Project,
  useCreateProjectMutation,
  useGetAllLegalUsersQuery,
  useUpdateProjectMutation
} from "@vardast/graphql/generated"
import { MultiStatusesFa } from "@vardast/lib/constants"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import { Modal, ModalProps } from "@vardast/ui/modal"
import { SelectPopover } from "@vardast/ui/select-popover"
import { Textarea } from "@vardast/ui/textarea"
import { enumToKeyValueObject } from "@vardast/util/enumToKeyValueObject"
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"

import { IOrderPageSectionProps } from "@/app/(layout)/(bid)/types/type"

const ProjectModal = ({
  open,
  onCloseModals,
  modals
}: IOrderPageSectionProps<Project & { id?: number }>) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()
  const [nameOrUuid, setNameOrUuid] = useState("")

  const isEdit = modals?.data?.id

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectInputSchema())
  })

  const getAllLegalUsers = useGetAllLegalUsersQuery(
    graphqlRequestClientWithToken,
    {
      indexLegalInput: { nameOrUuid }
    },
    {
      enabled: open
    }
  )

  const createProjectMutation = useCreateProjectMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data?.createProject?.id) {
          router.push(
            `${process.env.NEXT_PUBLIC_BIDDING_PATH}projects/${data.createProject.id}`
          )
        }
      }
    }
  )

  const updateProjectMutation = useUpdateProjectMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: (data) => {
        if (data) {
          onCloseModals(data)
        }
      }
    }
  )

  const onSubmit = (data: CreateProjectInput) => {
    const body = {
      ...data,
      wallet: data?.wallet ? digitsFaToEn(data?.wallet) : undefined
    }

    for (const key in body) {
      if (!body[key]) {
        delete body[key]
      }
    }

    if (isEdit) {
      updateProjectMutation.mutate({
        updateProjectInput: {
          ...body,
          id: modals.data?.id
        }
      })
    } else {
      createProjectMutation.mutate({
        createProjectInput: body
      })
    }
  }

  useEffect(() => {
    if (isEdit) {
      const { wallet, name, description, legal, status } = modals?.data
      setMultiFormValues(
        {
          wallet: wallet ? digitsEnToFa(wallet) : undefined,
          name,
          description,
          legalId: legal?.id,
          status
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
      ? t("common:edit_entity", { entity: t("common:project") })
      : t("common:add_new_entity", { entity: t("common:project") }),
    action: {
      title: t("common:save_entity", { entity: t("common:project") }),
      loading:
        createProjectMutation.isLoading || updateProjectMutation.isLoading,
      disabled:
        createProjectMutation.isLoading || updateProjectMutation.isLoading
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
          <FormItem className="col-span-1">
            <FormLabel>
              {t("common:entity_name", { entity: t("common:project") })}
            </FormLabel>
            <FormControl>
              <Input
                disabled={
                  createProjectMutation.isLoading ||
                  createProjectMutation.isError
                }
                type="text"
                {...field}
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
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:status")}</FormLabel>
            <FormControl>
              <SelectPopover
                options={Object.entries(
                  enumToKeyValueObject(MultiStatuses)
                )?.map(([value, key]) => ({
                  key: MultiStatusesFa[key as MultiStatuses]?.name_fa,
                  value: value.toUpperCase()
                }))}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue(
                    "status",
                    value.toUpperCase() as MultiStatuses,
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
        name="legalId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("common:entity_name", { entity: t("common:company") })}
            </FormLabel>
            <FormControl>
              <SelectPopover
                disabled={
                  getAllLegalUsers?.data?.findAllLegals?.data.length === 0
                }
                loading={getAllLegalUsers.isLoading}
                options={getAllLegalUsers?.data?.findAllLegals?.data?.map(
                  (legal) => ({
                    key: `${legal?.name_company}`,
                    value: `${legal?.id}`
                  })
                )}
                setSearch={setNameOrUuid}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue("legalId", +value, {
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
    </Modal>
  )
}
export default ProjectModal
