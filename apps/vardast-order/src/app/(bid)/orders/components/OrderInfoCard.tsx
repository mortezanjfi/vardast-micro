"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import { DetailsWithTitle } from "@vardast/component/desktop/DetailsWithTitle"
import {
  PaymentMethodEnumFa,
  PreOrderStatesFa
} from "@vardast/component/desktop/OrderCart"
import { useFindPreOrderByIdQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Badge } from "@vardast/ui/badge"
import useTranslation from "next-translate/useTranslation"
import { DateObject } from "react-multi-date-picker"

type OrderInfoCardProps = {
  uuid: string
}

const OrderInfoCard = ({ uuid }: OrderInfoCardProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )

  const orderInfo = useMemo(
    () => findPreOrderByIdQuery?.data?.findPreOrderById,
    [findPreOrderByIdQuery?.data]
  )

  const mappedObject = useMemo(() => {
    return [
      {
        //  نام درخواست کننده
        title: t("common:entity_name", { entity: t("common:applicant_name") }),
        text: orderInfo?.applicant_name
      },
      {
        //  کارشناس خرید
        title: t("common:entity_name", { entity: t("common:expert_name") }),
        text: orderInfo?.expert_name
      },
      {
        //  نام پروژه
        title: t("common:entity_name", { entity: t("common:project") }),
        text: orderInfo?.project?.name
      },
      {
        // آدرس پروژه
        title: t("common:project-address"),
        text: orderInfo?.project?.address[0]?.address?.address
      },
      {
        // تحویل گیرنده
        title: t("common:transferee"),
        text: orderInfo?.project?.address[0]?.address?.delivery_name
      },
      {
        // شماره تماس تحویل گیرنده
        title: t("common:transferee-number"),
        text: orderInfo?.project?.address[0]?.address?.delivery_contact
      },
      {
        //  آد رس
        title: t("common:shipping-address"),
        text: orderInfo?.project?.address[0]?.address?.address
      },
      {
        //  زمان ثبت سفارش
        title: t("common:submission-time"),
        text: orderInfo?.request_date
          ? digitsEnToFa(
              new Date(orderInfo?.request_date).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric"
              })
            )
          : ""
      },
      {
        // روش پرداخت
        title: t("common:pay-method"),
        text: PaymentMethodEnumFa[orderInfo?.payment_methods]?.name_fa
      },
      {
        // زمان نیاز
        title: t("common:order-needed-time"),
        text: orderInfo?.need_date
          ? digitsEnToFa(
              new DateObject(new Date(orderInfo?.need_date))
                .toDate()
                .toLocaleDateString("fa-IR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "numeric"
                })
            )
          : "-"
      },
      {
        // توضیحات
        title: "توضیحات سفارش",
        text: orderInfo?.descriptions
      }
    ]
  }, [orderInfo])

  return (
    <Card
      title={t("common:order-info")}
      button={{
        onClick: () =>
          router.push(
            `/profile/orders/${findPreOrderByIdQuery?.data?.findPreOrderById?.id}/info`
          ),
        text: "ویرایش",
        type: "button"
      }}
      template="1/2-sm"
    >
      <div className="col-span-2 flex gap-6 py">
        <Badge>
          {t("common:entity_code", { entity: t("common:order") })}{" "}
          {findPreOrderByIdQuery?.data?.findPreOrderById?.uuid &&
            digitsEnToFa(findPreOrderByIdQuery?.data?.findPreOrderById?.uuid)}
        </Badge>
        <Badge variant={PreOrderStatesFa[orderInfo?.status]?.variant}>
          {PreOrderStatesFa[orderInfo?.status]?.name_fa}
        </Badge>
      </div>
      {mappedObject.map((props) => (
        <DetailsWithTitle
          textCustomStyle="whitespace-nowrap line-clamp-1"
          {...props}
        />
      ))}
    </Card>
  )
}

export default OrderInfoCard
