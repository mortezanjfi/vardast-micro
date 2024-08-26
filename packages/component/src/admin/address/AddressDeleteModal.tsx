 
"use client"

import { useState } from "react"
import { Address, useRemoveAddressMutation } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

const AddressDeleteModal = <TEnum,>({
  open,
  modals,
  onCloseModals
}: IUseModal<TEnum, Address>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()

  const removeAddressMutation = useRemoveAddressMutation(
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
    removeAddressMutation.mutate({
      id: modals?.data?.id
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
      onClick: () => onSubmit(),
      title: t("common:delete"),
      disabled: removeAddressMutation.isLoading,
      loading: removeAddressMutation.isLoading
    }
  }

  return <Modal {...modalProps} />
}

export default AddressDeleteModal
