import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateUserProjectInput,
  CreateUserProjectInputSchema,
  Project,
  TypeMember,
  useAssignUserProjectMutation,
  useGetMembersQuery
} from "@vardast/graphql/generated"
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
import { setMultiFormValues } from "@vardast/util/setMultiFormValues"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { OrderModalEnum } from "@/app/(layout)/(bid)/types/type"

const ProjectMemberModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<OrderModalEnum, Project>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()

  const form = useForm<CreateUserProjectInput>({
    resolver: zodResolver(CreateUserProjectInputSchema().omit({ type: true }))
  })

  z.setErrorMap(zodI18nMap)

  const getMembersQuery = useGetMembersQuery(
    graphqlRequestClientWithToken,
    {
      indexMemberInput: {
        type: TypeMember.Legal,
        relatedId: modals?.data?.legal?.id
      }
    },
    {
      enabled: open
    }
  )

  const assignUserProjectMutation = useAssignUserProjectMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        if (data) {
          onCloseModals(data)
        }
      }
    }
  )

  const onSubmit = (data: CreateUserProjectInput) => {
    assignUserProjectMutation.mutate({
      createUserProjectInput: data
    })
  }

  useEffect(() => {
    setMultiFormValues({ projectId: +modals?.data?.id }, form.setValue)
    return () => {
      form.reset()
      setErrors(undefined)
    }
  }, [modals?.data])

  const modalProps: ModalProps = {
    open,
    onOpenChange: onCloseModals,
    errors,
    title: t("common:add_new_entity", { entity: t("common:colleague") }),
    action: {
      title: t("common:save_entity", { entity: t("common:colleague") }),
      loading: assignUserProjectMutation.isLoading,
      disabled: assignUserProjectMutation.isLoading
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
        name="memberId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:city")}</FormLabel>
            <FormControl>
              <SelectPopover
                internalSearchable
                loading={getMembersQuery.isFetching}
                options={getMembersQuery.data?.members?.data?.map((member) => ({
                  key: member?.user?.fullName,
                  value: `${member?.id}`
                }))}
                value={`${field.value}`}
                onSelect={(value) => {
                  form.setValue("memberId", +value, {
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

export default ProjectMemberModal
