import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { ProductModalEnum } from "@vardast/component/type"
import {
  AttributeValue,
  useRemoveAttributeValueMutation
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

const AttributeDeleteModal = ({
  open,
  modals,
  onCloseModals
}: IUseModal<ProductModalEnum, AttributeValue>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const removeProductMutation = useRemoveAttributeValueMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["GetAllProducts"]
        })
        onCloseModals(data)
      }
    }
  )
  const onDelete = () => {
    removeProductMutation.mutate({ id: modals.data.id })
  }
  const modalProps: ModalProps = {
    open,
    modalType: "delete",
    size: "sm",
    onOpenChange: onCloseModals,
    errors,
    title: t("common:delete_entity", { entity: t("common:product") }),
    description: t(
      "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
      {
        entity: `${t(`common:product`)}`,
        name: modals?.data?.value
      }
    ),
    action: { onClick: () => onDelete(), title: t("common:delete") }
  }

  return <Modal {...modalProps} />
}

export default AttributeDeleteModal
