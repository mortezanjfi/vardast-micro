"use client"

import { useState } from "react"
import { MultiTypeOrder } from "@vardast/graphql/generated"
import { OrderProductTabContentProps } from "@vardast/type/OrderProductTabs"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import useTranslation from "next-translate/useTranslation"

export const OrderExtraPriceTabContent = ({
  addProductLine
}: OrderProductTabContentProps) => {
  const [expenses, setExpenses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

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
      <div className="flex flex-col gap-2 pt-5">
        {additionalExpenses.map((item) => (
          <div key={item} className="form-item checkbox-field gap-4">
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
      </div>
      <div className="flex flex-row-reverse py-5">
        <Button
          variant="outline-primary"
          disabled={!expenses.length || loading}
          loading={loading}
          onClick={onSubmit}
          type="submit"
          className="py-3"
        >
          {t("common:add-to_entity", { entity: t("common:order") })}
        </Button>
      </div>
    </>
  )
}
