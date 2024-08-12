/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
import {
  Address,
  useRemoveAddressProjectMutation
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

import { OrderModalEnum } from "@/app/(layout)/(bid)/types/type"

const ProjectAddressDeleteModal = ({
  open,
  modals,
  onCloseModals
}: IUseModal<OrderModalEnum, Address & { projectId: number }>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()

  const removeAddressProjectMutation = useRemoveAddressProjectMutation(
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

  const onDelete = () => {
    removeAddressProjectMutation.mutate({
      addressId: modals?.data?.id,
      projectId: modals?.data?.projectId
    })
  }

  const modalProps: ModalProps = {
    open,
    modalType: "delete",
    size: "sm",
    onOpenChange: onCloseModals,
    errors: errors,
    title: t("common:delete_entity", { entity: t("common:address") }),
    description: t(
      "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
      {
        entity: `${t(`common:address`)}`,
        name: modals?.data?.title
      }
    ),
    action: {
      onClick: () => onDelete(),
      title: t("common:delete"),
      disabled: removeAddressProjectMutation.isLoading,
      loading: removeAddressProjectMutation.isLoading
    }
  }

  return <Modal {...modalProps} />
}

export default ProjectAddressDeleteModal
