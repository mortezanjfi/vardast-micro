"use client"

import { digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import { FindPreOrderByIdQuery } from "@vardast/graphql/generated"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import Card from "../Card"
import { DetailsWithTitle } from "./DetailsWithTitle"
import { PaymentMethodEnumFa, PreOrderStatesFa } from "./OrderCart"

type OrderInfoCardProps = {
  findPreOrderByIdQuery: UseQueryResult<FindPreOrderByIdQuery, unknown>
}

const OrderInfoCard = ({ findPreOrderByIdQuery }: OrderInfoCardProps) => {
  const { t } = useTranslation()

  const orderInfo = findPreOrderByIdQuery?.data?.findPreOrderById

  return (
    <Card
      title={t("common:order-info")}
      className="h-fit"
      titleClass="text-base pb-2 border-b-2 border-primary-600"
    >
      <div className="flex flex-col gap-4 pt-5">
        <div className="flex gap-5">
          <div className="tag flex w-fit gap-2 border border-alpha-400 bg-alpha-50 px-4 py-1">
            <span>
              {t("common:entity_code", { entity: t("common:project") })}
            </span>
            <span>
              {findPreOrderByIdQuery?.data?.findPreOrderById?.id &&
                digitsEnToFa(findPreOrderByIdQuery?.data?.findPreOrderById?.id)}
            </span>
          </div>
          <div
            className={clsx(
              "tag",
              PreOrderStatesFa[orderInfo?.status]?.className
            )}
          >
            {/* <Dot /> */}
            <span>{PreOrderStatesFa[orderInfo?.status]?.name_fa}</span>
          </div>
        </div>
        <div className={"flex grid-cols-2 flex-col md:grid 2xl:grid-cols-3"}>
          {/* نام خریدار */}
          <div className="flex flex-col">
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:entity_name", { entity: t("common:purchaser") })}
              text={orderInfo?.user?.fullName}
            />
            {/* شماره تماس خریدار */}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:purchaser-number")}
              text={orderInfo?.user?.cellphone}
            />
            {/* نام پروژه */}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:entity_name", { entity: t("common:project") })}
              text={orderInfo?.project?.name}
            />

            <>
              {/*آدرس پروژه*/}
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:project-address")}
                text={orderInfo?.project?.address[0]?.address?.address}
              />
              {/*تحویل گیرنده*/}
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:transferee")}
                text={orderInfo?.project?.address[0]?.address?.delivery_name}
              />
              {/*شماره تماس تحویل گیرنده */}
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:transferee-number")}
                text={orderInfo?.project?.address[0]?.address?.delivery_contact}
              />{" "}
            </>
          </div>
          {/*آدرس محل تحویل*/}
          <div className={"flex flex-col 2xl:col-span-2"}>
            <>
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:shipping-address")}
                text={orderInfo?.project?.address[0]?.address?.address}
              />{" "}
              {/* زمان ثبت سفارش*/}
              <DetailsWithTitle
                textCustomStyle="whitespace-nowrap line-clamp-1"
                title={t("common:submission-time")}
                text={
                  orderInfo?.request_date
                    ? digitsEnToFa(
                        new Date(orderInfo?.request_date).toLocaleDateString(
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
              title={t("common:pay-method")}
              text={PaymentMethodEnumFa[orderInfo?.payment_methods]?.name_fa}
            />
            {/* توضیحات روش پرداخت*/}
            {/* <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title={t("common:pay-method-description")}
              text={"-"}
            /> */}
            {/*زمان اعتبار سفارش*/}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
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
            />{" "}
            {/*توضیحات*/}
            <DetailsWithTitle
              textCustomStyle="whitespace-nowrap line-clamp-1"
              title="توضیحات سفارش"
              text={orderInfo?.descriptions}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default OrderInfoCard
