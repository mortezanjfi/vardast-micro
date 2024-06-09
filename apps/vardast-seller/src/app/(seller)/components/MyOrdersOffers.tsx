"use client"

import OrderOffers, {
  OrderOffersPageType
} from "@vardast/component/desktop/OrderOffers"
import { useFindPreOrderByIdQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"

import SellersList from "@/app/(seller)/components/SellersList"

type MyOrdersOffersProps = { isMobileView: boolean; uuid: string }
const MyOrdersOffers = ({ isMobileView, uuid }: MyOrdersOffersProps) => {
  const findPreOrderByIdQuery = useFindPreOrderByIdQuery(
    graphqlRequestClientWithToken,
    {
      id: +uuid
    }
  )
  return (
    <>
      <OrderOffers
        isMobileView={isMobileView}
        uuid={uuid}
        type={OrderOffersPageType.SELLER_MY_ORDERS_OFFERS}
        findPreOrderByIdQuery={findPreOrderByIdQuery}
        AddOfferChildren={
          <>
            <SellersList
              isMobileView={isMobileView}
              findPreOrderByIdQuery={findPreOrderByIdQuery}
              uuid={uuid}
            />
          </>
        }
      />
    </>
  )
}

export default MyOrdersOffers
