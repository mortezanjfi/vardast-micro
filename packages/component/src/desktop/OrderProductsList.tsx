import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "./CardContainer"

type OrderProductsListProps = { data: any }

function OrderProductsList({ data }: OrderProductsListProps) {
  const { t } = useTranslation()

  return (
    <CardContainer title="لیست کالاها">
      <table className="table border-collapse border">
        <thead>
          <tr>
            <th className="border align-middle">{t("common:row")}</th>
            <th className="border align-middle"> {t("common:product_sku")}</th>
            <th className="border align-middle">
              {t("common:entity_name", { entity: t("common:product") })}
            </th>
            <th className="border align-middle">{t("common:brand")}</th>
            <th className="border align-middle">{t("common:unit")}</th>
            <th className="border align-middle">{t("common:value")}</th>
            <th className="border align-middle">{t("common:attributes")}</th>
            <th
              className="flex w-full flex-col items-center !px-0 !pb-0"
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
              {/* <table className="min-w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>قیمت خریدار</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      // className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      قیمت واحد
                    </th>
                    <th
                      scope="col"
                      // className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      مالیات ارزش افزوده
                    </th>
                    <th
                      scope="col"
                      // className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      قیمت کل
                    </th>
                  </tr>
                </tbody>
              </table> */}
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

                  <td className="border">{digitsEnToFa(order.unit)}</td>

                  <td className="border">{digitsEnToFa(order.value)}</td>
                  <td className="border">
                    <div className="flex gap-1">
                      {order.attributes.map((attribute) => (
                        <span className="tag tag-gray px-3">{attribute}</span>
                      ))}
                    </div>
                  </td>
                  <td className="grid grid-cols-3  !p-0">
                    <span className="flex justify-center border-x px-4 py-3">
                      {" "}
                      {digitsEnToFa(addCommas(order.purchaserPrice.basePrice))}
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
    </CardContainer>
  )
}

export default OrderProductsList
