"use client"

import { useRouter } from "next/navigation"
import { Button } from "@vardast/ui/button"

import CardContainer from "@vardast/component/desktop/CardContainer"

type OrderSubmitProps = { uuid: string }

function OrderSubmit({ uuid }: OrderSubmitProps) {
  const router = useRouter()
  return (
    <CardContainer title="ثبت سفارش">
      <div className="flex w-full items-center justify-between">
        <p>
          با توجه به فایل آپلود شده توسط خریدار، ابتدا باید کالاهای خریدار را به
          سفارش اضافه کنید.
        </p>
        <Button
          className="py-2"
          onClick={() => {
            router.push(`/orders/${uuid}/add-order-product`)
          }}
          variant="primary"
        >
          افزودن کالا به سفارش
        </Button>
      </div>
    </CardContainer>
  )
}

export default OrderSubmit
