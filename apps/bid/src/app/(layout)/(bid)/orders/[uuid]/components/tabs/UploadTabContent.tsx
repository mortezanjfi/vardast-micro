/* eslint-disable no-unused-vars */
import Card from "@vardast/component/Card"
import Dropzone from "@vardast/component/Dropzone"
import Link from "@vardast/component/Link"
import { useAddFilePreOrderMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import { uploadPaths } from "@vardast/lib/uploadPaths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { OrderProductTabContentProps } from "@vardast/type/OrderProductTabs"
import { ClientError } from "graphql-request"

function UploadTabContent({ uuid, onSubmit }: OrderProductTabContentProps) {
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
        onSubmit()
        toast({
          title: "فایل با موفقیت اضافه شد",
          duration: 5000,
          variant: "success"
        })
      }
    }
  )

  return (
    <>
      <Card className="col-span-full">
        <Dropzone
          uploadPath={uploadPaths.orderPriceList}
          onAddition={(file) => {
            addFilePreOrderMutation.mutate({
              addFilePreOrderInput: {
                file_uuid: file.uuid as string,
                pre_order_id: +uuid
              }
            })
          }}
          withHeight={false}
        />
      </Card>
      <Card className="col-span-full">
        <Dropzone
          uuidForCsv={uuid}
          isCsv={true}
          onAddition={() => {
            onSubmit()
          }}
          withHeight={false}
        />
        <Link
          href="https://storage.vardast.com/vardast/order/example-order-csv.csv"
          target="_blank"
          className="btn btn-md btn-primary"
        >
          دانلود فایل csv نمونه
        </Link>
      </Card>
    </>
  )
}

export default UploadTabContent
