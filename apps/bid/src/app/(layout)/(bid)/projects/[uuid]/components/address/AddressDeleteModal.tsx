/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  ProjectAddress,
  useRemoveAddressProjectMutation
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Modal, ModalProps } from "@vardast/ui/modal"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

import { IOrderPageSectionProps } from "@/app/(layout)/(bid)/types/type"

const AddressDeleteModal = ({
  open,
  modals,
  onCloseModals,
  uuid
}: IOrderPageSectionProps<ProjectAddress>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const removeAddressProjectMutation = useRemoveAddressProjectMutation(
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
    removeAddressProjectMutation.mutate({
      addressId: +modals?.data?.id,
      projectId: +uuid
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
    action: { onClick: () => onDelete(), title: t("common:delete") }
  }

  return <Modal {...modalProps} />
}

export default AddressDeleteModal
