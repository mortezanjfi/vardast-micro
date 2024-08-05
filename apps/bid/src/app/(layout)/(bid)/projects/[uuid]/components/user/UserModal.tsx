import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa, digitsFaToEn } from "@persian-tools/persian-tools"
import { useQueryClient } from "@tanstack/react-query"
import {
  useAssignUserProjectMutation,
  User,
  UserProject
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
import { Modal, ModalProps } from "@vardast/ui/modal"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { cellphoneNumberSchema } from "@vardast/util/zodValidationSchemas"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { IOrderPageSectionProps } from "@/app/(layout)/(bid)/types/type"

export const AddUserModalFormSchema = z.object({
  cellphone: cellphoneNumberSchema
})

type AddUserModalFormType = TypeOf<typeof AddUserModalFormSchema>

export const UserModal = ({
  modals,
  open,
  onCloseModals,
  uuid
}: IOrderPageSectionProps<User>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const form = useForm<AddUserModalFormType>({
    resolver: zodResolver(AddUserModalFormSchema)
  })

  z.setErrorMap(zodI18nMap)

  const assignUserProjectMutation = useAssignUserProjectMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
        onCloseModals()
      }
    }
  )

  const onSubmit = (data: AddUserModalFormType) => {
    assignUserProjectMutation.mutate({
      createUserProjectInput: {
        cellphone: digitsFaToEn(data.cellphone),
        projectId: +uuid
      }
    })
  }

  useEffect(() => {
    if (modals?.data?.cellphone) {
      form.setValue("cellphone", digitsEnToFa(modals?.data?.cellphone))
    } else {
      form.reset()
    }
    return () => {
      form.reset()
      setErrors(undefined)
    }
  }, [modals, modals?.data as unknown as UserProject])

  const modalProps: ModalProps = {
    open: open,
    onOpenChange: onCloseModals,
    errors,
    title: t("common:add_new_entity", { entity: t("common:colleague") }),
    description: t(
      "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
      {
        entity: `${t(`common:user`)}`,
        name: modals?.data?.fullName
      }
    ),
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
        name="cellphone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common:cellphone")}</FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                placeholder={digitsEnToFa("09*********")}
                {...field}
                onChange={(e) =>
                  e.target.value.length <= 11 &&
                  field.onChange(digitsEnToFa(e.target.value))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Modal>
  )
}
