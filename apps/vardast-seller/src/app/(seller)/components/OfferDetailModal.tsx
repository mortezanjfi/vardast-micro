"use client"

import { Dispatch, SetStateAction } from "react"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { Dialog, DialogContent, DialogHeader } from "@vardast/ui/dialog"
import { Input } from "@vardast/ui/input"
import clsx from "clsx"
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
        <table
          className={clsx(
            "table min-w-full border-collapse overflow-x-auto border"
          )}
        >
          <thead>
            <tr>
              <th className="whitespace-nowrap border align-middle">
                {t("common:row")}
              </th>
              <th className="whitespace-nowrap border align-middle">
                {" "}
                {t("common:product_sku")}
              </th>
              <th className="whitespace-nowrap border align-middle">
                {t("common:entity_name", { entity: t("common:product") })}
              </th>
              <th className="whitespace-nowrap border align-middle">
                {t("common:brand")}
              </th>
              <th className="whitespace-nowrap border align-middle">
                {t("common:unit")}
              </th>
              <th className="whitespace-nowrap border align-middle">
                {t("common:value")}
              </th>
              <th className="whitespace-nowrap border align-middle">
                {t("common:attributes")}
              </th>
              <th className="flex w-full flex-col items-center whitespace-nowrap !px-0 !pb-0">
                <div className="grid w-full grid-cols-3 border-b py-3">
                  <div></div>
                  <span className="flex justify-center">قیمت خریدار</span>
                  <div></div>
                </div>
                <div className="grid w-full grid-cols-3">
                  <span className="flex justify-center border-x py-3">
                    قیممت واحد
                  </span>
                  <span className="flex justify-center border-x py-3">
                    مالیات ارزش افزوده
                  </span>
                  <span className="flex justify-center border-x py-3">
                    قیمت کل
                  </span>
                </div>
              </th>
              <th className="flex w-full flex-col items-center whitespace-nowrap !px-0 !pb-0">
                <div className="grid w-full grid-cols-3 border-b py-3">
                  <div></div>
                  <span className="flex justify-center">قیمت خریدار</span>
                  <div></div>
                </div>
                <div className="grid w-full grid-cols-3">
                  <span className="flex justify-center border-x py-3">
                    قیممت واحد
                  </span>
                  <span className="flex justify-center border-x py-3">
                    مالیات ارزش افزوده
                  </span>
                  <span className="flex justify-center border-x py-3">
                    قیمت کل
                  </span>
                </div>
              </th>
              <th className="flex w-full flex-col items-center whitespace-nowrap !px-0 !pb-0">
                <div className="grid w-full grid-cols-3 border-b py-3">
                  <div></div>
                  <span className="flex justify-center">قیمت خریدار</span>
                  <div></div>
                </div>
                <div className="grid w-full grid-cols-3">
                  <span className="flex justify-center border-x py-3">
                    قیممت واحد
                  </span>
                  <span className="flex justify-center border-x py-3">
                    مالیات ارزش افزوده
                  </span>
                  <span className="flex justify-center border-x py-3">
                    قیمت کل
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map(
              (order, index) =>
                order && (
                  <tr key={order.id}>
                    <td className="w-4 border">
                      <span>{digitsEnToFa(index + 1)}</span>
                    </td>
                    <td className="border">
                      <span className="font-medium text-alpha-800">
                        {order.product_sku}
                      </span>
                    </td>
                    <td className="border">
                      <span className="font-medium text-alpha-800">
                        {order.productName}
                      </span>
                    </td>
                    <td className="border">
                      <span className="font-medium text-alpha-800">
                        {order.brand}
                      </span>
                    </td>

                    <td className="border">{digitsEnToFa(1236)}</td>

                    <td className="border">{digitsEnToFa(85495)}</td>
                    <td className="border">
                      <div className="flex gap-1">
                        {order.attributes.map((attribute) => (
                          <span className="tag tag-sm tag-gray">
                            {attribute}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="grid grid-cols-3  !p-0">
                      <span className="flex justify-center border-x px-4 py-3">
                        {" "}
                        {digitsEnToFa(
                          addCommas(order.purchaserPrice.basePrice)
                        )}
                      </span>
                      <span className="flex justify-center border-x px-4 py-3">
                        {" "}
                        {digitsEnToFa(addCommas(order.purchaserPrice.tax))}
                      </span>
                      <span className="flex justify-center border-x px-4 py-3">
                        {" "}
                        {digitsEnToFa(addCommas(order.purchaserPrice.total))}
                      </span>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  )
}

export default OfferDetailModal
