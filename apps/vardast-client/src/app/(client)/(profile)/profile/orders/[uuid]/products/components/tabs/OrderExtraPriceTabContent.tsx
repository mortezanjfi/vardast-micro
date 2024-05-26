"use client"

import { useState } from "react"
import { MultiTypeOrder } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"

import { OrderProductTabContentProps } from "@/app/(client)/(profile)/profile/orders/[uuid]/products/components/OrderProductsTabs"

export const OrderExtraPriceTabContent = ({
  addProductLine
}: OrderProductTabContentProps) => {
  const [expenses, setExpenses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const additionalExpenses = ["انبارداری", "بارگیری", "باسکول", "حمل", "تخلیه"]

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    Promise.all(
      expenses.map((item_name) => {
        addProductLine({
          item_name,
          type: MultiTypeOrder.Service
        })
      })
    )
      .then(() => {
        setLoading(false)
        setExpenses([])
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <div className="flex flex-col gap-2 border-b py-5">
        <span className=" pb-2 text-lg font-semibold">هزینه های جانبی </span>
        <p className="text-sm">
          هزینه های جانبی سفارش خود را انتخاب کرده و سپس قیمت گذاری کنید.
        </p>
      </div>
      <div className="py-5">
        {additionalExpenses.map((item) => (
          <div key={item} className="form-item checkbox-field">
            <div className="form-control">
              <Checkbox
                checked={expenses.includes(item)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setExpenses((prev) => [...prev, item])
                  } else {
                    setExpenses((prev) =>
                      prev.filter((value) => value !== item)
                    )
                  }
                }}
              />
            </div>
            <div className="form-label">{item}</div>
          </div>
        ))}
        <div className="flex flex-row-reverse py-5">
          <Button
            disabled={!expenses.length || loading}
            loading={loading}
            onClick={onSubmit}
            type="button"
            variant="primary"
          >
            افزودن هزینه های جانبی
          </Button>
        </div>
      </div>
    </>
  )
}
