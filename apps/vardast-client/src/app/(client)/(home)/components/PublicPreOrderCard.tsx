import { digitsEnToFa } from "@persian-tools/persian-tools"
import { DetailsWithTitle } from "@vardast/component/desktop/DetailsWithTitle"
import DynamicHeroIcon from "@vardast/component/DynamicHeroIcon"
import { PublicPreOrderDto } from "@vardast/graphql/generated"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import useTranslation from "next-translate/useTranslation"

type Props = { data: PublicPreOrderDto }

export const PublicPreOrderCardSkeleton = () => {
  return (
    <div className="flex flex-col divide-y border-l px-5">
      <span className="animated-card mb-5 h-5 w-1/2 text-lg font-semibold"></span>
      <div className="flex flex-col gap-3 py-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animated-card h-5 w-52"></span>
          </div>
          <span className="animated-card h-5 w-12"></span>
        </div>
        <span className="animated-card h-5 w-32"></span>
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
        <span className="animated-card h-5 w-32"></span>
        <span className="animated-card h-5 w-32"></span>
        <span className="animated-card h-5 w-32"></span>
      </div>
    </div>
  )
}

function PublicPreOrderCard({ data }: Props) {
  const { t } = useTranslation()
  return (
    data && (
      <div className="flex flex-col divide-y border-l px-5">
        <span className="pb-5 text-lg font-semibold">{data.categoryName}</span>
        {data.orders.map((order, index) => (
          <div className="flex flex-col gap-3 py-5">
            <div
              key={order.id}
              className="flex w-full items-center justify-between"
            >
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
                {/* <DetailsWithTitle title={t("common:destination")} /> */}
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
                  text={digitsEnToFa(
                    new Date(order.bid_start).toLocaleDateString("fa-IR", {
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
                  title={t("common:bid-end-time")}
                  text={digitsEnToFa(
                    new Date(order.bid_end).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  )}
                />
              </li>
            </ol>
          </div>
        ))}
      </div>
    )
  )
}

export default PublicPreOrderCard
