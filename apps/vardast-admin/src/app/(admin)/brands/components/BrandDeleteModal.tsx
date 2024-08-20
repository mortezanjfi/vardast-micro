"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { BrandModalEnum } from "@vardast/component/type"
import { Product, useRemoveBrandMutation } from "@vardast/graphql/generated"
import { useToast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"

const BrandDeleteModal = ({
  modals,
  onChangeModals,
  onCloseModals
}: IUseModal<BrandModalEnum, Product>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const removeBrandMutation = useRemoveBrandMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["GetAllBrands"]
        })
        onChangeModals()
        toast({
          description: t("common:entity_removed_successfully", {
            entity: `${t(`common:brand`)}`
          }),
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  const onDelete = () => {
    removeBrandMutation.mutate({
      id: modals.data.id
    })
  }

  const modalProps: ModalProps = {
    open: modals?.type === BrandModalEnum.DELETE,
    modalType: "delete",
    size: "sm",
    onOpenChange: onCloseModals,
    errors,
    title: t("common:delete_entity", { entity: t("common:brand") }),
    description: t(
      "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
      {
        entity: `${t(`common:brand`)}`,
        name: modals?.data?.name
      }
    ),
    action: { onClick: () => onDelete(), title: t("common:delete") }
  }

  return <Modal {...modalProps} />
}

export default BrandDeleteModal
