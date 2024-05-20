"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import CardContainer from "@/app/(admin)/orders/components/CardContainer"
import { OrdersFilter } from "@/app/(admin)/orders/components/OrdersFilter"

type Props = {}
const filterSchema = z.object({
  projectCode: z.string(),
  purchaserName: z.string(),
  projectName: z.string(),
  personInChargeId: z.number(),
  fileStatus: z.string(),
  orderStatus: z.string()
})

export type FilterFields = TypeOf<typeof filterSchema>

function OrdersPage({}: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [orderQUeryParams, setOrderQUeryParams] = useState({
    projectCode: "",
    purchaserName: "",
    projectName: "",
    personInChargeId: 0,
    fileStatus: "",
    orderStatus: ""
  })

  const form = useForm<FilterFields>({
    resolver: zodResolver(filterSchema)
  })

  const fakeData = [
    {
      id: 3,
      projectName: "Innovative AI Development",
      personInCharge: "Jane Doe",
      dateOfSubmission: "2023-11-01",
      dateOfExpiry: "2024-11-01",
      hasFile: true,
      status: false,
      projectCode: "AI-DEV-001",
      purchaser: "Tech Solutions Inc."
    }
  ]

  return (
    <div className="flex flex-col gap-9">
      <OrdersFilter form={form} setOrderQUeryParams={setOrderQUeryParams} />
      <CardContainer title="لیست‌ سفارشات">
        <table className="table-hover table">
          <thead>
            <tr>
              <th>{t("common:row")}</th>
              <th> {t("common:entity_code", { entity: t("common:order") })}</th>
              <th>{t("common:purchaser")}</th>
              <th>
                {t("common:entity_name", { entity: t("common:project") })}
              </th>
              <th>{t("common:submition-time")}</th>
              <th>{t("common:order-expire-time")}</th>
              <th>{t("common:file")}</th>
              <th>{t("common:status")}</th>
              <th>{t("common:person-in-charge")}</th>
            </tr>
          </thead>

          <tbody className="border-collapse border">
            {fakeData.map(
              (order, index) =>
                order && (
                  <tr
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(`/orders/${order.id}/order-detail`)
                    }}
                  >
                    <td className="w-4">
                      <span>{digitsEnToFa(index + 1)}</span>
                    </td>
                    <td>
                      <span className="font-medium text-alpha-800">
                        {order.projectCode}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium text-alpha-800">
                        {order.purchaser}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium text-alpha-800">
                        {order.projectName}
                      </span>
                    </td>
                    <td>
                      {digitsEnToFa(
                        new Date(order.dateOfSubmission).toLocaleDateString(
                          "fa-IR",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                          }
                        )
                      )}
                    </td>
                    <td>
                      {digitsEnToFa(
                        new Date(order.dateOfExpiry).toLocaleDateString(
                          "fa-IR",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                          }
                        )
                      )}
                    </td>
                    <td>
                      {" "}
                      {order.hasFile ? (
                        <span className="tag  tag-sm tag-success">
                          {t("common:has")}
                        </span>
                      ) : (
                        <span className="tag tag-sm tag-danger">
                          {t("common:has_not")}
                        </span>
                      )}
                    </td>
                    <td>
                      {order.status ? (
                        <span className="tag  tag-sm tag-success">
                          {t("common:active")}
                        </span>
                      ) : (
                        <span className="tag tag-sm tag-danger">
                          {t("common:not-active")}
                        </span>
                      )}
                    </td>
                    <td>{order.personInCharge}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
        {/* <Pagination
          total={orders.data?.orders.lastPage ?? 0}
          page={currentPage}
          onChange={(page) => {
            setCurrentPage(page)
          }}
        /> */}
      </CardContainer>
    </div>
  )
}

export default OrdersPage
