import { UseQueryResult } from "@tanstack/react-query"
import { GetAllProductsQuery } from "@vardast/graphql/generated"
import clsx from "clsx"
import useTranslation from "next-translate/useTranslation"

import MobileHomeSection from "@/app/(client)/(home)/components/MobileHomeSection"
import NewPriceSlider from "@/app/(client)/(home)/components/NewPriceSlider"

type Props = {
  isMobileView?: boolean
  query: UseQueryResult<GetAllProductsQuery, unknown>
}

const NewestPriceProductSection = ({ isMobileView, query }: Props) => {
  const { t } = useTranslation()
  const limitPage = 5

  return (
    <div className={clsx(!isMobileView && "overflow-x-hidden")}>
      {query?.data?.products?.data?.length > 0 && (
        <MobileHomeSection bgWhite title={t("common:newest-price")}>
          <NewPriceSlider query={query} />
        </MobileHomeSection>
      )}
    </div>
  )
}

export default NewestPriceProductSection
