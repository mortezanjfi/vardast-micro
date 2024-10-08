import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { ProductModalEnum } from "@vardast/component/type"
import { Offer, useRemoveOfferMutation } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

const OfferDeleteModal = ({
  open,
  modals,
  onCloseModals
}: IUseModal<ProductModalEnum, Offer>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const removeOfferMutation = useRemoveOfferMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["GetAllOffers"]
        })
        onCloseModals(data)
      }
    }
  )
  const onDelete = () => {
    removeOfferMutation.mutate({ offerId: modals?.data?.id })
  }
  const modalProps: ModalProps = {
    open,
    modalType: "delete",
    size: "sm",
    onOpenChange: onCloseModals,
    errors,
    title: t("common:delete_entity", { entity: t("common:offer") }),
    description: t(
      "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
      {
        entity: `${t(`common:offer`)}`,
        name: modals?.data?.seller?.name
      }
    ),
    action: { onClick: () => onDelete(), title: t("common:delete") }
  }

  return <Modal {...modalProps} />
}

export default OfferDeleteModal
