import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { Maybe, Price } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

setDefaultOptions({
  locale: faIR,
  weekStartsOn: 6
})

type PriceSectionProps = {
  prices: Maybe<Price>[] | undefined
  onOpenCreateModal: () => void
}

const PriceSection = ({ onOpenCreateModal, prices }: PriceSectionProps) => {
  const { t } = useTranslation()

  return (
    <div>
      <h2 className="section-title">
        {t("common:create_product_pricing_section_title")}
      </h2>
      <p className="section-description">
        {t("common:create_product_pricing_section_description")}
      </p>

      <div className="section-body">
        {prices && prices.length > 0 && (
          <div className="card table-responsive rounded">
            <table className="table">
              <thead>
                <tr>
                  <th>{t("common:price")}</th>
                  <th>{t("common:submitted_date")}</th>
                  <th>{t("common:seller")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {prices.map(
                  (price) =>
                    price && (
                      <tr key={price.id}>
                        <td>
                          {digitsEnToFa(addCommas(price.amount))}{" "}
                          {t("common:toman")}
                        </td>
                        <td>
                          {/* {digitsEnToFa(
                            formatDistanceToNow(
                              new Date(price.createdAt).getTime(),
                              {
                                addSuffix: true
                              }
                            )
                          )} */}
                          -
                        </td>
                        <td>{price.seller.name}</td>
                        <td>
                          {price.isPublic ? (
                            <span className="tag tag-sm tag-light tag-success">
                              {t("common:public")}
                            </span>
                          ) : (
                            <span className="tag tag-sm tag-light tag-gray">
                              {t("common:private")}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenCreateModal()}
          >
            {t("common:add_entity", { entity: t("common:price") })}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PriceSection
