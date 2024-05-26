"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CardContainer from "@vardast/component/desktop/CardContainer"
import OrderProductsList from "@vardast/component/desktop/OrderProductsList"
import SellerAdminConfirmationModal from "@vardast/component/desktop/SellerAdminConfirmationModal"
import { Button } from "@vardast/ui/button"

type Props = { uuid: string }

const AddOfferPrice = ({ uuid }: Props) => {
  const router = useRouter()
  const [open, onOpenChange] = useState<boolean>(false)

  const fakeData = [
    {
      id: 3,
      product_sku: "Innovative AI Development",
      productName: "test",
      brand: "test brand",
      unit: "60",
      value: 4,
      attributes: ["test", "test2"],
      purchaserPrice: { basePrice: 300, tax: 40, total: 340 }
    }
  ]

  const submitPage = () => {
    onOpenChange(true)
  }

  const submitModal = () => {
    onOpenChange(false)
    router.push(`/my-orders/${uuid}/order-detail`)
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
        <OrderProductsList isSellerAddPricePage={true} data={fakeData} />
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
