"use client"

import { UseQueryResult } from "@tanstack/react-query"
import BrandOrSellerCard, {
  BrandOrSellerCardSkeleton
} from "@vardast/component/BrandOrSellerCard"
import BrandsOrSellersContainer from "@vardast/component/BrandsOrSellersContainer"
import { GetUserFavoriteSellersQuery, Seller } from "@vardast/graphql/generated"
import { Session } from "next-auth"

import { NotFoundItems } from "@/app/(client)/favorites/components/FavoritesPageIndex"

type SellersTabContentProps = {
  sellerQuery: UseQueryResult<GetUserFavoriteSellersQuery, unknown>
  session: Session | null
}

export const SellersTabContent = ({
  session,
  sellerQuery
}: SellersTabContentProps) => {
  return (
    <>
      {sellerQuery.isFetching || sellerQuery.isLoading ? (
        <BrandsOrSellersContainer>
          {() => (
            <>
              <BrandOrSellerCardSkeleton />
              <BrandOrSellerCardSkeleton />
              <BrandOrSellerCardSkeleton />
            </>
          )}
        </BrandsOrSellersContainer>
      ) : sellerQuery.data?.favorites.seller.length ? (
        <BrandsOrSellersContainer>
          {({ selectedItemId, setSelectedItemId }) => (
            <>
              {sellerQuery.data?.favorites.seller.map(
                (seller) =>
                  seller && (
                    <BrandOrSellerCard
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                      key={seller.id}
                      content={{
                        ...(seller as Seller),
                        __typename: "Seller"
                      }}
                    />
                  )
              )}
            </>
          )}
        </BrandsOrSellersContainer>
      ) : (
        <NotFoundItems text="فروشنده‌" />
      )}
    </>
  )
}
