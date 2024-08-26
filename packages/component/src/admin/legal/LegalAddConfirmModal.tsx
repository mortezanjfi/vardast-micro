 
"use client"

import { Legal } from "@vardast/graphql/generated"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import useTranslation from "next-translate/useTranslation"

const LegalAddConfirmModal = <TEnum,>({
  open,
  onChangeModals,
  onCloseModals
}: IUseModal<TEnum, Legal>) => {
  const { t } = useTranslation()

  const onSubmit = () => {
    onChangeModals()
  }

  const modalProps: ModalProps = {
    open,
    size: "sm",
    onOpenChange: onCloseModals,
    title: `${t("common:the_company_is_not_registered_in_our_system")}!`,
    description: t("common:would_you_like_to_create_company"),
    action: {
      onClick: () => onSubmit(),
      title: t("common:add")
    }
  }

  return <Modal {...modalProps} />
}

export default LegalAddConfirmModal
