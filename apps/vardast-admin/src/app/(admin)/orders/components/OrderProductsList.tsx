import { digitsEnToFa } from "@persian-tools/persian-tools"
import useTranslation from "next-translate/useTranslation"

import CardContainer from "@/app/(admin)/orders/components/CardContainer"

type OrderProductsListProps = {}

function OrderProductsList({}: OrderProductsListProps) {
  const { t } = useTranslation()
  const fakeData = [
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
    <CardContainer title="لیست کالاها">
      <table className="table-hover table border-collapse border">
        <thead>
          <tr>
            <th>{t("common:row")}</th>
            <th> {t("common:product_sku")}</th>
            <th>{t("common:entity_name", { entity: t("common:product") })}</th>
            <th>{t("common:brand")}</th>
            <th>{t("common:unit")}</th>
            <th>{t("common:value")}</th>
            <th>{t("common:attributes")}</th>
            <th
              className="flex w-full flex-col items-center"
              // scope="col"
              // className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              <div className="grid w-full grid-cols-3 border-b">
                <div></div>
                <span>قیمت خریدار</span>
                <div></div>
              </div>
              <div className="grid grid-cols-3">
                <span>قیممت واحد</span>
                <span>مالیات ارزش افزوده</span>
                <span>قیمت کل</span>
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

        <tbody className="border-collapse border">
          {fakeData.map(
            (order, index) =>
              order && (
                <tr key={order.id}>
                  <td className="w-4">
                    <span>{digitsEnToFa(index + 1)}</span>
                  </td>
                  <td>
                    <span className="font-medium text-alpha-800">
                      {order.product_sku}
                    </span>
                  </td>
                  <td>
                    <span className="font-medium text-alpha-800">
                      {order.productName}
                    </span>
                  </td>
                  <td>
                    <span className="font-medium text-alpha-800">
                      {order.brand}
                    </span>
                  </td>

                  <td>{order.unit}</td>

                  <td>{order.value}</td>
                  <td>
                    <div className="flex gap-1">
                      {order.attributes.map((attribute) => (
                        <span className="tag-gray">{attribute}</span>
                      ))}
                    </div>
                  </td>
                  <td className="grid grid-cols-3">
                    <span> {order.purchaserPrice.basePrice}</span>
                    <span> {order.purchaserPrice.tax}</span>
                    <span> {order.purchaserPrice.total}</span>
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
