import { digitsEnToFa } from "@persian-tools/persian-tools"
import { PreOrderDto } from "@vardast/graphql/generated"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import useTranslation from "next-translate/useTranslation"

import { DetailsWithTitle } from "../desktop/DetailsWithTitle"
import DynamicHeroIcon from "../DynamicHeroIcon"

type Props = { order: PreOrderDto }
type orderPreviewCardSkeleton = {
  categoryName?: boolean
}
export const OrderPreviewCardSkeleton = ({
  categoryName = true
}: orderPreviewCardSkeleton) => {
  return (
    <div className="flex flex-col divide-y px-5 pt-5">
      {categoryName && (
        <span className="animated-card mb-5 h-5 w-1/2 text-lg font-semibold" />
      )}
      <div className="flex flex-col gap-3 py-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animated-card h-5 w-52"></span>
          </div>
          <span className="animated-card h-5 w-12"></span>
        </div>
        <span className="animated-card h-5 w-20"></span>
        <span className="animated-card h-5 w-44"></span>
        <span className="animated-card h-5 w-32"></span>
        <span className="animated-card h-5 w-32"></span>
      </div>
      <div className="flex flex-col gap-3 py-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animated-card h-5 w-52"></span>
          </div>
          <span className="animated-card h-5 w-12"></span>
        </div>
        <span className="animated-card h-5 w-20"></span>
        <span className="animated-card h-5 w-44"></span>
        <span className="animated-card h-5 w-32"></span>
        <span className="animated-card h-5 w-32"></span>
      </div>
    </div>
  )
}

const OrderPreviewCard = ({ order }: Props) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <DynamicHeroIcon
            icon="ClipboardDocumentListIcon"
            className={mergeClasses(
              "icon h-7 w-7 transform rounded-md bg-primary-600 p-1 text-alpha-white transition-all"
            )}
            solid={false}
          />

          <span className="font-semibold">
            سفارش شماره ({digitsEnToFa(order.uuid)})
          </span>
        </div>
        <span className="tag tag-info text-xs">
          {digitsEnToFa(
            new Date(order.request_date).toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            })
          )}
        </span>
      </div>
      <ol className="gap-2">
        <li>
          <DetailsWithTitle
            title={t("common:destination")}
            text={order.destination ? order.destination : "-"}
          />
        </li>
        <li>
          <DetailsWithTitle
            title={t("common:needed-time")}
            text={digitsEnToFa(
              new Date(order.need_date).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              })
            )}
          />
        </li>
        <li>
          <DetailsWithTitle
            title={t("common:bid-start-time")}
            text={
              order.bid_start
                ? digitsEnToFa(
                    new Date(order.bid_start).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  )
                : "-"
            }
          />
        </li>
        <li>
          <DetailsWithTitle
            title={t("common:bid-end-time")}
            text={
              order.bid_end
                ? digitsEnToFa(
                    new Date(order.bid_end).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  )
                : "-"
            }
          />
        </li>
      </ol>
    </div>
  )
}

export default OrderPreviewCard
