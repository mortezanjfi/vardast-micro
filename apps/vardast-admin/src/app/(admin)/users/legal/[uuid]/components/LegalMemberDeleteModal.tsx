 
"use client"

import { useState } from "react"
import { Member, useRemoveMemberMutation } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

const LegalMemberDeleteModal = <TEnum,>({
  open,
  modals,
  onCloseModals
}: IUseModal<TEnum, Member>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()

  const removeMemberMutation = useRemoveMemberMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        onCloseModals(data)
      }
    }
  )

  const onSubmit = () => {
    removeMemberMutation.mutate({
      id: modals?.data?.id
    })
  }

  const modalProps: ModalProps = {
    open,
    modalType: "delete",
    size: "sm",
    onOpenChange: onCloseModals,
    errors: errors,
    title: t("common:delete_entity", { entity: t("common:member") }),
    description: t(
      "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
      {
        entity: `${t(`common:member`)}`,
        name: modals?.data?.user?.fullName
      }
    ),
    action: {
      onClick: () => onSubmit(),
      title: t("common:delete"),
      disabled: removeMemberMutation.isLoading,
      loading: removeMemberMutation.isLoading
    }
  }

  return <Modal {...modalProps} />
}

export default LegalMemberDeleteModal
