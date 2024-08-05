"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateProjectInput,
  CreateProjectInputSchema,
  TypeProject,
  useCreateProjectMutation,
  useGetAllLegalUsersQuery
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
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
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"

import { IOrderPageSectionProps } from "@/app/(layout)/(bid)/types/type"

const AddProjectModal = ({
  open,
  onCloseModals
}: IOrderPageSectionProps<CreateProjectInput>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const [nameOrUuid, setNameOrUuid] = useState("")

  const router = useRouter()

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
            `${process.env.NEXT_PUBLIC_BIDDING_PATH}projects/${data.createProject.id}/?mode=new`
          )
          form.reset()
        } else {
          toast({
            description: "خطا درایجاد پروژه",
            duration: 2000,
            variant: "danger"
          })
        }
        form.reset()
      }
    }
  )

  const onSubmit = (createProjectInput: CreateProjectInput) => {
    createProjectMutation.mutate({
      createProjectInput
    })
  }

  useEffect(() => {
    form.reset()
  }, [open])

  const modalProps: ModalProps = {
    open: open,
    onOpenChange: onCloseModals,
    errors,
    title: t("common:add_new_entity", { entity: t("common:colleague") }),
    action: {
      title: t("common:save_entity", { entity: t("common:colleague") }),
      loading: createProjectMutation.isLoading,
      disabled: createProjectMutation.isLoading
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
        name="type"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>
              {t("common:entity_type", { entity: t("common:project") })}
            </FormLabel>
            <FormControl toggleInputGroup="h-full" className="h-14">
              <ToggleGroup
                defaultValue={TypeProject.Legal}
                className="input-field grid grid-cols-2 p-0.5"
                type="single"
                value={field.value}
                onValueChange={(value: TypeProject) => {
                  if (value) {
                    form.setValue("type", value)
                    form.setValue("cellphone", "")
                  }
                }}
              >
                <ToggleGroupItem
                  className={clsx(
                    "h-full rounded-xl p-0.5 text-alpha-500",
                    form.watch("type") === TypeProject.Legal &&
                      "!bg-alpha-white !text-alpha-black shadow-lg"
                  )}
                  value={TypeProject.Legal}
                >
                  {t("common:legal")}
                </ToggleGroupItem>
                <ToggleGroupItem
                  className={clsx(
                    "h-full rounded-xl p-0.5 text-alpha-500",
                    form.watch("type") === TypeProject.Real &&
                      "!bg-alpha-white !text-alpha-black shadow-lg"
                  )}
                  value={TypeProject.Real}
                >
                  {t("common:real")}
                </ToggleGroupItem>
              </ToggleGroup>
            </FormControl>
          </FormItem>
        )}
      />
      {form.watch("type") === TypeProject.Real ? (
        <FormField
          control={form.control}
          name="cellphone"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>{t("common:cellphone")}</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder={t("common:enter")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="cellphone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("common:legal-user")}</FormLabel>
              <FormControl>
                <SelectPopover
                  onSelect={(value) => {
                    form.setValue("cellphone", value, {
                      shouldDirty: true
                    })
                  }}
                  loading={getAllLegalUsers.isLoading}
                  disabled={
                    getAllLegalUsers?.data?.findAllLegals?.data.length === 0
                  }
                  setSearch={setNameOrUuid}
                  options={getAllLegalUsers?.data?.findAllLegals?.data?.map(
                    (user) => ({
                      key: `${user?.name_company}`,
                      value: `${user?.owner?.cellphone}`
                    })
                  )}
                  value={`${field.value}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </Modal>
  )
}
export default AddProjectModal
