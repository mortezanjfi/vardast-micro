"use client"

import { useState } from "react"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import AddPriceModal from "./AddPriceModal"
import CardContainer from "./CardContainer"

type OrderProductsListProps = { isSellerAddPricePage?: boolean; data: any }

function OrderProductsList({
  isSellerAddPricePage,
  data
}: OrderProductsListProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [productIdToEdit, setProdctIdToEdit] = useState<number>()

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
        <div className={clsx(isSellerAddPricePage && "overflow-x-auto")}>
          <table
            className={clsx(
              "table min-w-full border-collapse border",
              isSellerAddPricePage && "overflow-x-auto"
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
                <th
                  className="flex w-full flex-col items-center whitespace-nowrap !px-0 !pb-0"
                  // scope="col"
                  // className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  <div className="grid w-full grid-cols-3 border-b py-3">
                    <div></div>
                    <span className="flex justify-center">
                      قیمت خریدار (تومان)
                    </span>
                    <div></div>
                  </div>
                  <div className="grid w-full grid-cols-3">
                    <span className="flex justify-center border-x py-3">
                      قیمت واحد
                    </span>
                    <span className="flex justify-center border-x py-3">
                      مالیات ارزش افزوده
                    </span>
                    <span className="flex justify-center border-x py-3">
                      قیمت کل
                    </span>
                  </div>
                </th>
                {isSellerAddPricePage && (
                  <th className="whitespace-nowrap border align-middle">
                    {t("common:operation")}
                  </th>
                )}
                {/* {isSellerAddPricePage && (
                <>
                  <th
                    className="flex w-full flex-col items-center whitespace-nowrap !px-0 !pb-0"
                    // scope="col"
                    // className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
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
                  <th
                    className="flex w-full flex-col items-center whitespace-nowrap !px-0 !pb-0"
                    // scope="col"
                    // className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
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
                </>
              )} */}
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
                      {isSellerAddPricePage && (
                        <td className="border">
                          <span
                            onClick={() => {
                              setProdctIdToEdit(order.id)
                              setOpen(true)
                            }}
                            className="tag cursor-pointer text-blue-500"
                          >
                            {t("common:add_entity", {
                              entity: t("common:price")
                            })}
                          </span>
                        </td>
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
