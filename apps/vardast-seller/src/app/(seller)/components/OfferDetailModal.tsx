"use client"

import { Dispatch, SetStateAction } from "react"
import OrderProductsList from "@vardast/component/desktop/OrderProductsList"
import { Dialog, DialogContent, DialogHeader } from "@vardast/ui/dialog"
import { Input } from "@vardast/ui/input"
import useTranslation from "next-translate/useTranslation"

type Props = {
  selectedOfferId: number
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function OfferDetailModal({ selectedOfferId, open, onOpenChange }: Props) {
  const { t } = useTranslation()

  const data = [
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-fit gap-7">
        <DialogHeader className="">
          <span>{t("common:details")}</span>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-7">
          <div className="flex flex-col gap-1">
            <span>
              {t("common:entity_name", { entity: t("common:seller") })}
            </span>
            <Input disabled className="w-full" value="seller name" />
          </div>
          <div className="flex flex-col gap-1">
            <span>{t("common:cellPhone")}</span>
            <Input disabled className="w-full" value="8888888888" />
          </div>
          <div className="flex flex-col gap-1">
            <span>{t("common:province")}</span>
            <Input disabled className="w-full" value="Tehran" />
          </div>
          <div className="flex flex-col gap-1">
            <span>{t("common:city")}</span>
            <Input disabled className="w-full" value="Tehran" />
          </div>
        </div>
        <OrderProductsList data={data} hasExtraInfo={true} />
      </DialogContent>
    </Dialog>
  )
}

export default OfferDetailModal
