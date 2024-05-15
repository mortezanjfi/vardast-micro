import { digitsEnToFa } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import useTranslation from "next-translate/useTranslation"

import { DetailsWithTitle } from "@/app/(client)/(profile)/profile/projects/components/DetailsWithTitle"

type OrderInfoCardProps = { uuid: string }

const OrderInfoCard = async ({}: OrderInfoCardProps) => {
  const { t } = useTranslation()

  const orderInfo = {
    purchaserName: "Fake Order 1",
    purchaserNumber: "Pending",
    payMethod: "Cash",
    projectCode: 123,
    name: "test2",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }

  return (
    <Card
      title={t("common:order-info")}
      className="h-fit"
      titleClass="text-base pb-5 pt-2 border-b"
    >
      <div className="flex flex-col gap-4 pt-5">
        <div className="tag flex w-fit gap-2 border border-alpha-400 bg-alpha-50 px-4 py-1">
          <span> کدسفارش:</span>
          <span>{orderInfo.projectCode}</span>
        </div>
        <div className="grid grid-cols-3 flex-col 2xl:flex">
          <DetailsWithTitle
            title={t("common:purchaser-name")}
            text={orderInfo.purchaserName}
          />
          <DetailsWithTitle
            title={t("common:purchaser-number")}
            text={orderInfo.purchaserNumber}
          />
          <DetailsWithTitle
            title={t("common:entity_name", { entity: t("common:project") })}
            text={orderInfo.name}
          />
          <DetailsWithTitle
            title={t("common:pay-method")}
            text={orderInfo.payMethod}
          />
          <DetailsWithTitle
            title={t("common:order-expire-time")}
            text={
              orderInfo.expiresAt
                ? digitsEnToFa(
                    new Date(orderInfo.expiresAt).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit"
                    })
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
