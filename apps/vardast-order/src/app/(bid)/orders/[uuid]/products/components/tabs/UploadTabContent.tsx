/* eslint-disable no-unused-vars */
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import Dropzone, {
  CsvWithPreview,
  FilesWithPreview
} from "@vardast/component/Dropzone"
import Link from "@vardast/component/Link"
import { Image, useAddFilePreOrderMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { OrderProductTabContentProps } from "@vardast/type/OrderProductTabs"
import { Button } from "@vardast/ui/button"
import { ClientError } from "graphql-request"

function UploadTabContent({ uuid }: OrderProductTabContentProps) {
  const [files, setFiles] = useState<FilesWithPreview[]>([])
  const [csvFile, setCsvFIle] = useState<CsvWithPreview[]>([])
  const queryClient = useQueryClient()
  const [images, setImages] = useState<
    { uuid: string; expiresAt: string; image?: Image }[]
  >([])

  const [csvImages, setCsvImages] = useState<
    { uuid: string; expiresAt: string; image?: Image }[]
  >([])
  const [csv, setCsv] = useState<
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

      <div className="p-0.5">
        <Dropzone
          uuidForCsv={uuid}
          isCsv={true}
          manualFileState={[csvFile, setCsvFIle]}
          onAddition={(file) => {
            setCsvImages((prevImages) => [
              ...prevImages,
              {
                uuid: file.uuid as string,
                expiresAt: file.expiresAt as string
              }
            ])
            queryClient.invalidateQueries({
              queryKey: ["FindPreOrderById"]
            })
          }}
          withHeight={false}
        />
      </div>
      <div className="flex w-full justify-end">
        <Link
          href="https://storage.vardast.com/vardast/order/example-order-csv.csv"
          target="_blank"
        >
          <Button type="button" variant="primary" className="py-3">
            دانلود فایل csv نمونه
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default UploadTabContent
