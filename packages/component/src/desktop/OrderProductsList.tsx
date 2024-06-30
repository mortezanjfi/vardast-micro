"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import {
  FindPreOrderByIdQuery,
  Line,
  useFindOfferPreOrderByIdQuery
} from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ACTION_BUTTON_TYPE } from "@vardast/type/OrderProductTabs"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import { cardButton } from "../Card"
import AddPriceModal from "./AddPriceModal"
import CardContainer from "./CardContainer"

type OrderProductsListProps = {
  isSeller?: boolean
  actionButtonType?: ACTION_BUTTON_TYPE
  isMobileView?: boolean
  hasOperation?: boolean
  hasExtraInfo?: boolean
  button?: cardButton
  offerId?: string
  findPreOrderByIdQuery: UseQueryResult<FindPreOrderByIdQuery, unknown>
}

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

function OrderProductsList({
  isSeller,
  actionButtonType,
  button,
  isMobileView,
  hasOperation,
  hasExtraInfo,
  offerId,
  findPreOrderByIdQuery
}: OrderProductsListProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [priceModalData, setPriceModalData] = useState<{
    line: Line
    fi_price: string
  }>()

  const offersQuery = useFindOfferPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +offerId
    },
    {
      enabled: !!offerId
    }
  )

  const lines: Line[] = offerId
    ? (offersQuery.data?.findOfferPreOrderById?.offerLine?.map(
        (item) => item?.line
      ) as Line[])
    : (findPreOrderByIdQuery.data?.findPreOrderById?.lines as Line[])

  const getLineOfferByLineId = (lineId: number) => {
    return offersQuery.data?.findOfferPreOrderById?.offerLine?.find(
      (item) => item?.line?.id === lineId
    )
  }

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
      display: !!offerId,
      element: "div",
      children: "قیمت (تومان)"
    },
    {
      colSpan: 3,
      display: !!offerId && hasExtraInfo,
      element: "div",
      children: "قیمت فروشنده (تومان)"
    },
    {
      colSpan: 4,
      display: !!offerId && hasExtraInfo,
      element: "div",
      children: "قیمت پیشنهادی وردست (تومان)"
    }
  ]

  return (
    <>
      {offerId && (
        <AddPriceModal
          line={priceModalData?.line as Line}
          setOpen={setOpen}
          open={open}
          offerId={offerId}
          fi_price={priceModalData?.fi_price}
        />
      )}
      <CardContainer title="لیست کالاها" button={button}>
        <div className="max-w-full overflow-x-auto">
          <table
            className={clsx(
              "table min-w-full border-collapse overflow-x-auto border"
            )}
          >
            <thead>
              <tr>
                {tableHead?.map(
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
                {offerId && hasOperation && (
                  <th colSpan={1} rowSpan={2} className={clsx(thClassName)}>
                    {t("common:operation")}
                  </th>
                )}
              </tr>
              {offerId && (
                <tr>
                  <TablePriceHead />
                  {hasExtraInfo && (
                    <>
                      <TablePriceHead />
                      <TablePriceHead isVardast={true} />
                    </>
                  )}
                </tr>
              )}
            </thead>

            <tbody>
              {lines?.map((line, index) => (
                <tr key={line.id}>
                  <td className={tdClassName}>
                    <span>{digitsEnToFa(index + 1)}</span>
                  </td>
                  <td className={tdClassName}>
                    <span className="font-medium text-alpha-800">
                      {line?.id && digitsEnToFa(line?.id)}
                    </span>
                  </td>
                  <td className={tdClassName}>
                    <span className="font-medium text-alpha-800">
                      {line?.item_name && digitsEnToFa(line?.item_name)}
                    </span>
                  </td>
                  <td className={tdClassName}>
                    <span className="font-medium text-alpha-800">
                      {line?.brand}
                    </span>
                  </td>

                  <td className={tdClassName}>{line?.uom}</td>

                  <td className={tdClassName}>
                    {line?.qty && digitsEnToFa(line?.qty)}
                  </td>
                  <td className={tdClassName}>
                    {line?.attribuite ? (
                      <span className="tag tag-sm tag-gray">
                        {line?.attribuite}
                      </span>
                    ) : (
                      "-"
                    )}
                    {/* <div className="flex gap-1">
                          {line?.attributes.map((attribute) => (
                            <span className="tag tag-sm tag-gray">
                              {attribute}
                            </span>
                          ))}
                        </div> */}
                  </td>
                  {offerId && (
                    <>
                      <td className="border-x px-4 py-3">
                        {digitsEnToFa(
                          addCommas(getLineOfferByLineId(line.id)?.fi_price)
                        )}
                      </td>
                      <td className="border-x px-4 py-3">
                        {digitsEnToFa(
                          addCommas(getLineOfferByLineId(line.id)?.tax_price)
                        )}
                      </td>
                      <td className="border-x px-4 py-3">
                        {digitsEnToFa(
                          addCommas(getLineOfferByLineId(line.id)?.total_price)
                        )}
                      </td>
                      {hasExtraInfo && (
                        <>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(getLineOfferByLineId(line.id)?.fi_price)
                            )}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(
                                getLineOfferByLineId(line.id)?.tax_price
                              )
                            )}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(
                                getLineOfferByLineId(line.id)?.total_price
                              )
                            )}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(getLineOfferByLineId(line.id)?.fi_price)
                            )}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(
                                getLineOfferByLineId(line.id)?.tax_price
                              )
                            )}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(
                                getLineOfferByLineId(line.id)?.total_price
                              )
                            )}
                          </td>
                          <td className="border-x px-4 py-3">
                            {digitsEnToFa(
                              addCommas(
                                getLineOfferByLineId(line.id)?.total_price
                              )
                            )}
                          </td>
                        </>
                      )}
                      {hasOperation && (
                        <td className={clsx(tdClassName, "whitespace-nowrap")}>
                          <span
                            onClick={() => {
                              setPriceModalData({
                                fi_price: getLineOfferByLineId(line.id)
                                  ?.fi_price,
                                line: getLineOfferByLineId(line.id)
                                  ?.line as Line
                              })
                              setOpen(true)
                            }}
                            className="cursor-pointer text-blue-500"
                          >
                            افزودن قیمت
                          </span>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContainer>
    </>
  )
}

export default OrderProductsList
