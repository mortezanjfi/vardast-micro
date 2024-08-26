"use client"

import { UseQueryResult } from "@tanstack/react-query"
import BrandOrSellerCard, {
  BrandOrSellerCardSkeleton
} from "@vardast/component/BrandOrSellerCard"
import BrandsOrSellersContainer from "@vardast/component/BrandsOrSellersContainer"
import { GetUserFavoriteSellersQuery, Seller } from "@vardast/graphql/generated"

import { NotFoundItems } from "@/app/(client)/profile/favorites/components/FavoritesPageIndex"

type SellersTabContentProps = {
  sellerQuery: UseQueryResult<GetUserFavoriteSellersQuery, unknown>
}

export const SellersTabContent = ({ sellerQuery }: SellersTabContentProps) => {
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
                      content={{
                        ...(seller as Seller),
                        __typename: "Seller"
                      }}
                      key={seller.id}
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
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
