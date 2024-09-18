"use client"

import { useState } from "react"
import Dropzone from "@vardast/component/Dropzone"
import { ProductModalEnum } from "@vardast/component/type"
import { Image, useCreateImageMutation } from "@vardast/graphql/generated"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { IUseModal, Modal, ModalProps } from "@vardast/ui/modal"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import useTranslation from "next-translate/useTranslation"
import { z } from "zod"

type CatalogImagesModalType = {
  productId?: number
  images?: Image[]
}

z.setErrorMap(zodI18nMap)

const CatalogImagesModal = ({
  modals,
  open,
  onCloseModals
}: IUseModal<ProductModalEnum, CatalogImagesModalType>) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const [localLoading, setLocalLoading] = useState(false)
  const [images, setImages] = useState<
    { uuid: string; expiresAt: string; image?: Image }[]
  >([])

  const createImageMutation = useCreateImageMutation(
    graphqlRequestClientWithToken
  )

  const onClick = () => {
    setLocalLoading(true)
    Promise.all(
      images.map(async (image, idx) => {
        await createImageMutation.mutateAsync({
          createImageInput: {
            productId: modals?.data?.productId,
            fileUuid: image.uuid,
            sort: idx,
            isPublic: true
          }
        })
      })
    )
      .catch((error) => setErrors(error))
      .finally(() => {
        onCloseModals()
        setLocalLoading(false)
      })
  }

  const modalProps: ModalProps = {
    open,
    onOpenChange: onCloseModals,
    errors,
    title: t("common:add_entity", { entity: t("common:image") }),
    action: {
      title: t("common:save"),
      type: "button",
      onClick,
      loading: localLoading || createImageMutation.isLoading,
      disabled: localLoading || createImageMutation.isLoading
    }
  }

  return (
    <>
      <Modal {...modalProps}>
        <Dropzone
          existingImages={modals?.data && modals?.data.images}
          maxFiles={20}
          uploadPath={uploadPaths.productImages}
          onAddition={(file) => {
            setImages((prevImages) => [
              ...prevImages,
              {
                uuid: file.uuid,
                expiresAt: file.expiresAt
              }
            ])
          }}
          onDelete={(file) => {
            setImages((images) =>
              images.filter((image) => image.uuid !== file.uuid)
            )
          }}
        />
      </Modal>
    </>
  )
}

export default CatalogImagesModal
