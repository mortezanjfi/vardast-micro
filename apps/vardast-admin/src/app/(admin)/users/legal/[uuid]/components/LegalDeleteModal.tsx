"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { LegalModalEnum } from "@vardast/component/type"
import { Legal, useRemoveLegalMutation } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

const LegalDeleteModal = ({
  modals,
  onChangeModals,
  onCloseModals
}: IUseModal<LegalModalEnum, Legal>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const removeLegalMutation = useRemoveLegalMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["GetAllLegalUsersQuery"]
        })
        onChangeModals()
      }
    }
  )

  const onDelete = () => {
    removeLegalMutation.mutate({
      id: modals?.data?.id
    })
  }

  const modalProps: ModalProps = {
    open: modals?.type === LegalModalEnum.DELETE,
    modalType: "delete",
    size: "sm",
    onOpenChange: onCloseModals,
    errors,
    title: t("common:delete_entity", { entity: t("common:user") }),
    description: t(
      "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
      {
        entity: `${t(`common:user`)}`,
        name: modals?.data?.owner?.fullName
      }
    ),
    action: { onClick: () => onDelete(), title: t("common:delete") }
  }

  return <Modal {...modalProps} />
}

export default LegalDeleteModal
