import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import { OfferLine, TypeOrderOffer } from "@vardast/graphql/generated"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import { DetailsWithTitle } from "@/app/(client)/(profile)/profile/projects/components/DetailsWithTitle"

type OfferCardProps = { offerLine: OfferLine }

function OfferCard({ offerLine }: OfferCardProps) {
  const { t } = useTranslation()
  const isVardast = offerLine.type === TypeOrderOffer.Vardast

  return (
    <Card
      className={clsx(
        "flex h-full flex-col justify-between border",
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
      <div className="flex h-full w-full flex-col">
        <DetailsWithTitle
          className="justify-between text-sm"
          title={t("common:unit-price")}
          text={
            offerLine?.fi_price && digitsEnToFa(addCommas(offerLine?.fi_price))
          }
        />
        <DetailsWithTitle
          className="justify-between text-sm"
          title={t("common:tax")}
          text={
            offerLine?.tax_price &&
            digitsEnToFa(addCommas(offerLine?.tax_price))
          }
        />
        <DetailsWithTitle
          className="justify-between text-sm"
          title={t("common:total-price")}
          text={
            offerLine?.total_price &&
            digitsEnToFa(addCommas(offerLine?.total_price))
          }
        />
      </div>
    </Card>
  )
}

export default OfferCard
