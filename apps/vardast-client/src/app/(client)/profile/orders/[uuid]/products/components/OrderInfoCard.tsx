"use client"

import { digitsEnToFa } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import { DetailsWithTitle } from "@vardast/component/desktop/DetailsWithTitle"
import useTranslation from "next-translate/useTranslation"

import { IOrderProductsInnerLayout } from "@/app/(client)/profile/orders/[uuid]/products/components/OrderInnerLayout"
import { PaymentMethodEnumFa } from "@/app/(client)/profile/orders/components/OrdersPage"

const OrderInfoCard = ({
  findPreOrderByIdQuery,
  uuid
}: IOrderProductsInnerLayout) => {
  const { t } = useTranslation()

  const orderInfo = findPreOrderByIdQuery?.data?.findPreOrderById

  return (
    <Card
      title={t("common:order-info")}
      className="h-fit"
      titleClass="text-base pb-5 pt-2 border-b"
    >
      <div className="flex flex-col gap-4 pt-5">
        <div className="tag flex w-fit gap-2 border border-alpha-400 bg-alpha-50 px-4 py-1">
          <span> کدسفارش:</span>
          <span>{digitsEnToFa(uuid)}</span>
        </div>
        <div className="grid grid-cols-3 flex-col 2xl:flex">
          <DetailsWithTitle
            title={t("common:purchaser-name")}
            text={orderInfo?.address?.delivery_name}
          />
          <DetailsWithTitle
            title={t("common:purchaser-number")}
            text={orderInfo?.address?.delivery_contact}
          />
          <DetailsWithTitle
            title={t("common:entity_name", { entity: t("common:project") })}
            text={orderInfo?.project?.name}
          />
          <DetailsWithTitle
            title={t("common:pay-method")}
            text={PaymentMethodEnumFa[orderInfo?.payment_methods]?.name_fa}
          />
          <DetailsWithTitle
            title={t("common:order-expire-time")}
            text={
              orderInfo?.expire_time
                ? digitsEnToFa(
                    new Date(orderInfo?.expire_time).toLocaleDateString(
                      "fa-IR",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                      }
                    )
                  )
                : ""
            }
          />
        </div>
      </div>
    </Card>
  )
}

export default OrderInfoCard
