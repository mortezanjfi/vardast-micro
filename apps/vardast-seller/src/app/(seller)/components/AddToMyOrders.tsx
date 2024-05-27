"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CardContainer from "@vardast/component/desktop/CardContainer"
import SellerAdminConfirmationModal from "@vardast/component/desktop/SellerAdminConfirmationModal"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"

type Props = {}

function AddToMyOrders({}: Props) {
  const router = useRouter()
  const [isResponsible, setIsResponsible] = useState<boolean>(false)
  const [open, onOpenChange] = useState<boolean>(false)

  const submit = () => {
    console.log("submit")
    onOpenChange(false)
  }

  const submitPage = () => {
    console.log(isResponsible)
    router.push("/my-orders")
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
        <div className="flex w-full flex-col justify-between gap-5 2xl:flex-row 2xl:items-center ">
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
      <div className="flex flex-row-reverse border-t pt-5">
        <Button
          onClick={() => {
            submitPage()
          }}
          className="py-2"
          type="submit"
          variant="primary"
        >
          تایید و ادامه
        </Button>
      </div>
    </>
  )
}

export default AddToMyOrders
