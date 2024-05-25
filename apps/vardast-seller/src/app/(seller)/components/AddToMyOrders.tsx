"use client"

import { useState } from "react"
import CardContainer from "@vardast/component/desktop/CardContainer"
import SellerAdminConfirmationModal from "@vardast/component/desktop/SellerAdminConfirmationModal"
import { Checkbox } from "@vardast/ui/checkbox"

type Props = {}

function AddToMyOrders({}: Props) {
  const [isResponsible, setIsResponsible] = useState<boolean>(false)
  const [open, onOpenChange] = useState<boolean>(false)

  const submit = () => {
    console.log("submit")
  }
  return (
    <>
      <SellerAdminConfirmationModal
        onSubmit={submit}
        content="پس از تایید، این سفارش به لیست سفارشات شما اضافه می شود و می توانید قیمت پیشنهادی خود را به خریدار اعلام نمایید."
        open={open}
        onOpenChange={onOpenChange}
        setIsResponsible={setIsResponsible}
      />
      <CardContainer title="انتخاب سفارش">
        {" "}
        <div className="flex w-full items-center justify-between">
          <p>
            در صورتی که مسئولیت این سفارش را می پذیرید، گزینه رو به رو را انتخاب
            کرده و تایید نمایید.
          </p>

          <div className="flex items-center gap-2">
            {" "}
            <Checkbox
              checked={isResponsible}
              onCheckedChange={(checked) => {
                setIsResponsible((prev) => !prev)
                onOpenChange(true)
                console.log(checked)

                return checked
              }}
            />
            <p>مسئولیت این سفارش را می پذیرم.</p>
          </div>
        </div>
      </CardContainer>
    </>
  )
}

export default AddToMyOrders
