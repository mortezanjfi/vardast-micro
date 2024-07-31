/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { User, useRemoveUserProjectMutation } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Modal, ModalProps } from "@vardast/ui/modal"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

import { IOrderPageSectionProps } from "@/types/type"

const UserDeleteModal = ({
  modals,
  open,
  onCloseModals,
  uuid
}: IOrderPageSectionProps<User>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const removeUserProjectMutation = useRemoveUserProjectMutation(
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

  const onDelete = () => {
    removeUserProjectMutation.mutate({
      userId: +modals?.data.id,
      projectId: +uuid
    })
  }

  const modalProps: ModalProps = {
    open,
    modalType: "delete",
    size: "sm",
    onOpenChange: onCloseModals,
    errors: errors,
    title: t("common:delete_entity", { entity: t("common:user") }),
    description: t(
      "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
      {
        entity: `${t(`common:user`)}`,
        name: modals?.data?.fullName
      }
    ),
    action: { onClick: () => onDelete(), title: t("common:delete") }
  }

  return <Modal {...modalProps} />
}

export default UserDeleteModal
