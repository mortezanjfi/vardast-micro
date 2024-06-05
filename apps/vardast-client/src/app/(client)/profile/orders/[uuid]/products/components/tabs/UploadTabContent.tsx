/* eslint-disable no-unused-vars */
import { useState } from "react"
import Dropzone, { FilesWithPreview } from "@vardast/component/Dropzone"
import { Image, useAddFilePreOrderMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { ClientError } from "graphql-request"

import { OrderProductTabContentProps } from "@/app/(client)/profile/orders/[uuid]/products/components/OrderProductsTabs"

function UploadTabContent({ uuid }: OrderProductTabContentProps) {
  const [files, setFiles] = useState<FilesWithPreview[]>([])
  const [images, setImages] = useState<
    { uuid: string; expiresAt: string; image?: Image }[]
  >([])

  const addFilePreOrderMutation = useAddFilePreOrderMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        ;(
          errors.response.errors?.at(0)?.extensions.displayErrors as string[]
        ).map((error) =>
          toast({
            description: error,
            duration: 5000,
            variant: "danger"
          })
        )
      },
      onSuccess: () => {
        setFiles([])
        setImages([])
        toast({
          title: "فایل با موفقیت اضافه شد",
          duration: 5000,
          variant: "success"
        })
      }
    }
  )

  const onSubmit = () => {
    Promise.all(
      images.map(async (image) => {
        await addFilePreOrderMutation.mutateAsync({
          addFilePreOrderInput: {
            file_uuid: image.uuid,
            pre_order_id: +uuid
          }
        })
      })
    )
  }

  return (
    <div className="flex w-full flex-col gap-5 py-5">
      <div className="p-0.5">
        <Dropzone
          manualFileState={[files, setFiles]}
          uploadPath={uploadPaths.orderPriceList}
          onAddition={(file) => {
            setImages((prevImages) => [
              ...prevImages,
              {
                uuid: file.uuid as string,
                expiresAt: file.expiresAt as string
              }
            ])
          }}
          withHeight={false}
          onDelete={(file) => {
            setImages((images) =>
              images.filter((image) => image.uuid !== file.uuid)
            )
          }}
        />
      </div>
      <div className="flex w-full justify-end">
        <Button
          type="button"
          disabled={!files.length || addFilePreOrderMutation.isLoading}
          loading={addFilePreOrderMutation.isLoading}
          variant="outline-primary"
          onClick={onSubmit}
          className="py-3"
        >
          افزودن به سفارش
        </Button>
      </div>
    </div>
  )
}

export default UploadTabContent
