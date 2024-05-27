import { digitsEnToFa } from "@persian-tools/persian-tools"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import Card from "../Card"
import { DetailsWithTitle } from "./DetailsWithTitle"

type OrderInfoCardProps = { uuid?: string }

const OrderInfoCard = async ({ uuid }: OrderInfoCardProps) => {
  const { t } = useTranslation()

  const orderInfo = {
    purchaserName: "Fake Order 1",
    purchaserNumber: "Pending",
    payMethod: "Cash",
    projectCode: 123,
    name: "test2",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    projectAddress: "address should be displayed here",
    transfereeName: "Ms. Test",
    transfereeNumber: 9122222222,
    shippingAddress: "address should be displayed here",
    payDescription: "description displayed here",
    orderDescription: "order description should e here",
    status: "test"
  }

  return (
    <Card
      title={t("common:order-info")}
      className="h-fit"
      titleClass="text-base pb-2 border-b-2 border-primary-600"
    >
      <div className="flex flex-col gap-4 pt-5">
        <div className="flex gap-5">
          <div className="tag flex w-fit gap-2 border border-alpha-400 bg-alpha-50 px-4 py-1">
            <span>{t("entity_code", { entity: t("common:project") })}</span>
            <span>{orderInfo.projectCode}</span>
          </div>
          <div className="tag flex w-fit gap-2 border border-alpha-400 bg-alpha-50 px-4 py-1">
            <span>{orderInfo.status}</span>
          </div>
        </div>
        <div className={clsx("grid grid-cols-2 2xl:grid-cols-3")}>
          {/* نام خریدار */}
          <div className="flex flex-col">
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:entity_name", { entity: t("common:purchaser") })}
              text={orderInfo.purchaserName}
            />
            {/* شماره تماس خریدار */}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:purchaser-number")}
              text={orderInfo.purchaserNumber}
            />
            {/* نام پروژه */}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:entity_name", { entity: t("common:project") })}
              text={orderInfo.name}
            />

            <>
              {/*آدرس پروژه*/}
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:project-address")}
                text={orderInfo.projectAddress}
              />
              {/*تحویل گیرنده*/}
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:transferee")}
                text={orderInfo.transfereeName}
              />
              {/*شماره تماس تحویل گیرنده */}
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:transferee-number")}
                text={orderInfo.transfereeNumber}
              />{" "}
            </>
          </div>
          {/*آدرس محل تحویل*/}
          <div className={clsx("flex flex-col 2xl:col-span-2")}>
            <>
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:shipping-address")}
                text={orderInfo.shippingAddress}
              />{" "}
              {/* زمان ثبت سفارش*/}
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:submition-time")}
                text={
                  orderInfo.createdAt
                    ? digitsEnToFa(
                        new Date(orderInfo.createdAt).toLocaleDateString(
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
            </>
            {/*روش پرداخت */}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:pay-method")}
              text={orderInfo.payMethod}
            />
            {/* توضیحات روش پرداخت*/}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:pay-method-description")}
              text={orderInfo.payDescription}
            />
            {/*زمان اعتبار سفارش*/}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:order-expire-time")}
              text={
                orderInfo.expiresAt
                  ? digitsEnToFa(
                      new Date(orderInfo.expiresAt).toLocaleDateString(
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
            />{" "}
            {/*توضیحات*/}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title="توضیحات سفارش"
              text={orderInfo.orderDescription}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default OrderInfoCard
