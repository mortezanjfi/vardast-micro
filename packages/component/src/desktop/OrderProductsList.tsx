"use client"

import { useState } from "react"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import { FindPreOrderByIdQuery, OfferLine } from "@vardast/graphql/generated"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import AddPriceModal from "./AddPriceModal"
import CardContainer from "./CardContainer"
import OfferCard from "./OfferCard"
import OrderProductCard from "./OrderProductCard"
import OrderProductListContainer, {
  OrderProductCardSkeleton
} from "./OrderProductListContainer"

type OrderProductsListProps = {
  isMobileView?: boolean
  hasOperation?: boolean
  hasExtraInfo?: boolean
  uuid: string
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
  isMobileView,
  hasOperation,
  hasExtraInfo,
  uuid,
  findPreOrderByIdQuery
}: OrderProductsListProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [lineToEdit, setLineToEdit] = useState<{
    lineId: number
    fi_price: string
  }>()

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
      children: "قیمت (تومان)"
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
    console.log("product Id:", lineToEdit)
    setOpen(false)
  }

  return (
    <>
      {/* <AddPriceModal
        productId={productIdToEdit}
        submitFunction={submit}
        open={open}
        setOpen={setOpen}
      /> */}
      <AddPriceModal
        lineId={lineToEdit?.lineId}
        setOpen={setOpen}
        open={open}
        offerId={uuid}
        fi_price={lineToEdit?.fi_price}
      />
      <CardContainer title="لیست کالاها">
        {isMobileView ? (
          <>
            {findPreOrderByIdQuery.isLoading &&
            findPreOrderByIdQuery.isFetching ? (
              <OrderProductListContainer>
                {() => (
                  <>
                    <OrderProductCardSkeleton />
                  </>
                )}
              </OrderProductListContainer>
            ) : (
              findPreOrderByIdQuery?.data?.findPreOrderById?.offers[
                findPreOrderByIdQuery?.data?.findPreOrderById?.offers.length - 1
              ]?.offerLine.map((offer, index) => (
                <div
                  key={index}
                  className="flex grid-cols-4 flex-col gap-4 py-5 md:grid"
                >
                  <div className="col-span-3">
                    {" "}
                    <OrderProductCard
                      line={{
                        id: offer.line.id,
                        item_name: offer.line.item_name,
                        type: offer.line.type,
                        brand: offer.line.brand,
                        descriptions: offer.line.descriptions,
                        qty: offer.line.qty,
                        uom: offer.line.uom
                      }}
                    />
                  </div>
                  <OfferCard offerLine={offer as OfferLine} />
                </div>
              ))
            )}
          </>
        ) : (
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
                  {hasOperation && (
                    <th colSpan={1} rowSpan={2} className={clsx(thClassName)}>
                      {t("common:operation")}
                    </th>
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
                {findPreOrderByIdQuery?.data?.findPreOrderById?.offers[
                  findPreOrderByIdQuery?.data?.findPreOrderById?.offers.length -
                    1
                ]?.offerLine.map((offer, index) => (
                  <tr key={offer.id}>
                    <td className={tdClassName}>
                      <span>{digitsEnToFa(index + 1)}</span>
                    </td>
                    <td className={tdClassName}>
                      <span className="font-medium text-alpha-800">
                        {offer?.id && digitsEnToFa(offer?.id)}
                      </span>
                    </td>
                    <td className={tdClassName}>
                      <span className="font-medium text-alpha-800">
                        {offer?.line?.item_name &&
                          digitsEnToFa(offer?.line?.item_name)}
                      </span>
                    </td>
                    <td className={tdClassName}>
                      <span className="font-medium text-alpha-800">
                        {offer?.line?.brand}
                      </span>
                    </td>

                    <td className={tdClassName}>{offer?.line?.uom}</td>

                    <td className={tdClassName}>
                      {offer?.line?.qty && digitsEnToFa(offer?.line?.qty)}
                    </td>
                    <td className={tdClassName}>
                      {offer?.line?.attribuite ? (
                        <span className="tag tag-sm tag-gray">
                          {offer?.line?.attribuite}
                        </span>
                      ) : (
                        "-"
                      )}
                      {/* <div className="flex gap-1">
                          {offer?.attributes.map((attribute) => (
                            <span className="tag tag-sm tag-gray">
                              {attribute}
                            </span>
                          ))}
                        </div> */}
                    </td>
                    <td className="border-x px-4 py-3">
                      {digitsEnToFa(addCommas(offer?.fi_price))}
                    </td>
                    <td className="border-x px-4 py-3">
                      {digitsEnToFa(addCommas(offer?.tax_price))}
                    </td>
                    <td className="border-x px-4 py-3">
                      {digitsEnToFa(addCommas(offer?.total_price))}
                    </td>
                    {hasExtraInfo && (
                      <>
                        <td className="border-x px-4 py-3">
                          {digitsEnToFa(addCommas(offer?.fi_price))}
                        </td>
                        <td className="border-x px-4 py-3">
                          {digitsEnToFa(addCommas(offer?.tax_price))}
                        </td>
                        <td className="border-x px-4 py-3">
                          {digitsEnToFa(addCommas(offer?.total_price))}
                        </td>
                        <td className="border-x px-4 py-3">
                          {digitsEnToFa(addCommas(offer?.fi_price))}
                        </td>
                        <td className="border-x px-4 py-3">
                          {digitsEnToFa(addCommas(offer?.tax_price))}
                        </td>
                        <td className="border-x px-4 py-3">
                          {digitsEnToFa(addCommas(offer?.total_price))}
                        </td>
                        <td className="border-x px-4 py-3">
                          {digitsEnToFa(addCommas(offer?.total_price))}
                        </td>
                      </>
                    )}
                    {hasOperation && (
                      <td className={clsx(tdClassName, "whitespace-nowrap")}>
                        <span
                          onClick={() => {
                            setLineToEdit({
                              fi_price: offer?.fi_price,
                              lineId: offer?.line?.id
                            })
                            setOpen(true)
                          }}
                          className="cursor-pointer text-blue-500"
                        >
                          افزودن قیمت
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContainer>
    </>
  )
}

export default OrderProductsList
