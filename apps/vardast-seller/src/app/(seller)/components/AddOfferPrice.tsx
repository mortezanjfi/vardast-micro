"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CardContainer from "@vardast/component/desktop/CardContainer"
import OrderProductsList from "@vardast/component/desktop/OrderProductsList"
import SellerAdminConfirmationModal from "@vardast/component/desktop/SellerAdminConfirmationModal"
import { useFindPreOrderByIdQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"

type Props = { uuid: string }

const AddOfferPrice = ({ uuid }: Props) => {
  const router = useRouter()
  const [open, onOpenChange] = useState<boolean>(false)

  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const submitPage = () => {
    onOpenChange(true)
  }

  const submitModal = () => {
    onOpenChange(false)
    router.push(`/my-orders/${uuid}/offers`)
  }

  return (
    <>
      <SellerAdminConfirmationModal
        onSubmit={submitModal}
        content={"از افزودن این فروشنده به لیست اطمینان دارید؟"}
        open={open}
        onOpenChange={onOpenChange}
      />
      <div className="flex flex-col gap-9">
        <OrderProductsList
          uuid={uuid}
          hasOperation={true}
          hasExtraInfo={true}
          findPreOrderByIdQuery={findPreOrderByIdQuery}
        />
        <CardContainer title="افزودن فروشنده به لیست فروشندگان">
          <div className="flex w-full items-center justify-between">
            <p>
              در صورت تکمیل، می توانید با زدن دکمه زیر، فروشنده را به لیست اضافه
              نمایید.
            </p>
            <Button
              onClick={() => {
                submitPage()
              }}
              className="py-2"
              type="submit"
              variant="primary"
            >
              افزودن فروشنده
            </Button>
          </div>
        </CardContainer>
      </div>
    </>
  )
}

export default AddOfferPrice
