import { UseQueryResult } from "@tanstack/react-query"
import { GetAllProductsQuery } from "@vardast/graphql/generated"
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
    <div>
      <MobileHomeSection
        bgWhite
        title={!isMobileView && t("common:newest-price")}
      >
        <NewPriceSlider query={query} />
      </MobileHomeSection>
    </div>
  )
}

export default NewestPriceProductSection
