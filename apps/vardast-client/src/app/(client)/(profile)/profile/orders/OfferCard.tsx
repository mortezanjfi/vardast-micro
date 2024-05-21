import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import { DetailsWithTitle } from "@vardast/component/desktop/DetailsWithTitle"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

type OfferCardProps = { offer: any; isVardast: boolean }

function OfferCard({ offer, isVardast }: OfferCardProps) {
  const { t } = useTranslation()
  return (
    <Card
      className={clsx(
        "h-fit border",
        isVardast
          ? "border-blue-300 bg-blue-50"
          : "border-alpha-300 bg-alpha-50"
      )}
      titleClass="text-sm"
      title={
        isVardast
          ? t("common:vardast-offer-price")
          : t("common:purchaser-initial-offer-price")
      }
    >
      <div className="flex w-full flex-col">
        <DetailsWithTitle
          className="justify-between text-sm"
          title={t("common:unit-price")}
          text={digitsEnToFa(addCommas(offer?.price))}
        />
        <DetailsWithTitle
          className="justify-between text-sm"
          title={t("common:tax")}
          text={digitsEnToFa(addCommas(offer?.tax))}
        />
        <DetailsWithTitle
          className="justify-between text-sm"
          title={t("common:total-price")}
          text={digitsEnToFa(addCommas(offer?.total))}
        />
      </div>
    </Card>
  )
}

export default OfferCard
