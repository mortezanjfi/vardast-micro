import { digitsEnToFa } from "@persian-tools/persian-tools"
import { PreOrderDto } from "@vardast/graphql/generated"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { newTimeConvertor } from "@vardast/util/convertToPersianDate"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import { DetailsWithTitle } from "../desktop/DetailsWithTitle"
import DynamicHeroIcon from "../DynamicHeroIcon"

type Props = { singleCard?: boolean; order: PreOrderDto }
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

const OrderPreviewCard = ({ order, singleCard }: Props) => {
  const { t } = useTranslation()

  return (
    <div
      className={clsx(
        "flex flex-col gap-3 py-5",
        singleCard && "px-5 ring-1 ring-alpha-200"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className=" flex items-center gap-2">
          <DynamicHeroIcon
            icon="ClipboardDocumentListIcon"
            className={mergeClasses(
              "icon h-7 w-7 flex-shrink-0 transform rounded-md bg-primary-600 p-1 text-alpha-white transition-all"
            )}
            solid={false}
          />

          <span className="line-clamp-2 text-sm font-semibold">
            {order.lineDetail}
          </span>
        </div>
        <span className="tag tag-info  !flex w-fit !items-center !justify-center text-xs">
          {newTimeConvertor(order.request_date)}
        </span>
      </div>
      <ol className="gap-2">
        <li>
          <DetailsWithTitle
            className="text-sm"
            title={t("common:city")}
            text={order.destination ? order.destination : "-"}
          />
        </li>
        <li>
          <DetailsWithTitle
            className="text-sm"
            title={t("common:needed-time")}
            text={digitsEnToFa(newTimeConvertor(order.need_date))}
          />
        </li>
        <li>
          <DetailsWithTitle
            className="text-sm"
            title={t("common:bid-start-time")}
            text={
              order.bid_start
                ? digitsEnToFa(newTimeConvertor(order.bid_start))
                : "-"
            }
          />
        </li>
        <li>
          <DetailsWithTitle
            className="text-sm"
            title={t("common:bid-end-time")}
            text={
              order.bid_start
                ? digitsEnToFa(newTimeConvertor(order.bid_end))
                : "-"
            }
          />
        </li>
      </ol>
    </div>
  )
}

export default OrderPreviewCard