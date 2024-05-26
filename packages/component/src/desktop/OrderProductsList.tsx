"use client"

import { useState } from "react"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import AddPriceModal from "./AddPriceModal"
import CardContainer from "./CardContainer"

type OrderProductsListProps = { hasExtraInfo?: boolean; data: any }

const thClassName = "whitespace-nowrap border align-middle"
const tdClassName = "border"
const TablePriceHead = ({ isVardast }: { isVardast?: boolean }) => {
  return (
    <>
      {isVardast && <th className={thClassName}>کمیسیون وردست (%)</th>}
      <th className={thClassName}>قیمت واحد</th>
      <th className={thClassName}>ارزش افزوده</th>
      <th className={thClassName}>قیمت کل</th>
    </>
  )
}

function OrderProductsList({ hasExtraInfo, data }: OrderProductsListProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [productIdToEdit, setProdctIdToEdit] = useState<number>()

  const tableHead = [
    { colSpan: 1, display: true, element: "td", children: t("common:row") },
    {
      colSpan: 1,
      display: true,
      element: "td",
      children: t("common:product_sku")
    },
    {
      colSpan: 1,
      display: true,
      element: "td",
      children: t("common:entity_name", { entity: t("common:product") })
    },
    { colSpan: 1, display: true, element: "td", children: t("common:brand") },
    { colSpan: 1, display: true, element: "td", children: t("common:unit") },
    { colSpan: 1, display: true, element: "td", children: t("common:value") },
    {
      colSpan: 1,
      display: true,
      element: "td",
      children: t("common:attributes")
    },
    {
      colSpan: 3,
      display: true,
      element: "div",
      children: "قیمت خریدار (تومان)"
    },
    {
      colSpan: 3,
      display: hasExtraInfo,
      element: "div",
      children: "قیمت فروشنده (تومان)"
    },
    {
      colSpan: 4,
      display: hasExtraInfo,
      element: "div",
      children: "قیمت پیشنهادی وردست (تومان)"
    }
  ]

  const submit = (data: any) => {
    console.log(data)
    console.log("product Id:", productIdToEdit)
    setOpen(false)
  }
  return (
    <>
      <AddPriceModal
        productId={productIdToEdit}
        submitFunction={submit}
        open={open}
        setOpen={setOpen}
      />

      <CardContainer title="لیست کالاها">
        <div className="max-w-full overflow-x-auto">
          <table
            className={clsx(
              "table min-w-full border-collapse overflow-x-auto border"
            )}
          >
            <thead>
              <tr>
                {tableHead.map(
                  (Thead) =>
                    Thead.display && (
                      <th
                        colSpan={Thead.colSpan}
                        rowSpan={Thead.element === "td" ? 2 : 1}
                        className={clsx(
                          thClassName,
                          Thead.element === "div" && "!text-center"
                        )}
                      >
                        {Thead.children}
                      </th>
                    )
                )}
              </tr>
              <tr>
                <TablePriceHead />
                {hasExtraInfo && (
                  <>
                    <TablePriceHead />
                    <TablePriceHead isVardast={true} />
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {data.map(
                (order, index) =>
                  order && (
                    <tr key={order.id}>
                      <td className={tdClassName}>
                        <span>{digitsEnToFa(index + 1)}</span>
                      </td>
                      <td className={tdClassName}>
                        <span className="font-medium text-alpha-800">
                          {order.product_sku}
                        </span>
                      </td>
                      <td className={tdClassName}>
                        <span className="font-medium text-alpha-800">
                          {order.productName}
                        </span>
                      </td>
                      <td className={tdClassName}>
                        <span className="font-medium text-alpha-800">
                          {order.brand}
                        </span>
                      </td>

                      <td className={tdClassName}>{digitsEnToFa(1236)}</td>

                      <td className={tdClassName}>{digitsEnToFa(85495)}</td>
                      <td className={tdClassName}>
                        <div className="flex gap-1">
                          {order.attributes.map((attribute) => (
                            <span className="tag tag-sm tag-gray">
                              {attribute}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="border-x px-4 py-3">
                        {digitsEnToFa(
                          addCommas(order.purchaserPrice.basePrice)
                        )}
                      </td>
                      <td className="border-x px-4 py-3">
                        {digitsEnToFa(addCommas(order.purchaserPrice.tax))}
                      </td>
                      <td className="border-x px-4 py-3">
                        {digitsEnToFa(addCommas(order.purchaserPrice.total))}
                      </td>
                      {hasExtraInfo && (
                        <>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(order.purchaserPrice.basePrice)
                            )}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(addCommas(order.purchaserPrice.tax))}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(order.purchaserPrice.total)
                            )}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(order.purchaserPrice.basePrice)
                            )}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(addCommas(order.purchaserPrice.tax))}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(order.purchaserPrice.total)
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </CardContainer>
    </>
  )
}

export default OrderProductsList
