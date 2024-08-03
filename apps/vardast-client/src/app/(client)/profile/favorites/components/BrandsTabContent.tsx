import { UseQueryResult } from "@tanstack/react-query"
import BrandOrSellerCard, {
  BrandOrSellerCardSkeleton
} from "@vardast/component/BrandOrSellerCard"
import BrandsOrSellersContainer from "@vardast/component/BrandsOrSellersContainer"
import { Brand, GetUserFavoriteBrandsQuery } from "@vardast/graphql/generated"

import { NotFoundItems } from "@/app/(client)/profile/favorites/components/FavoritesPageIndex"

type BrandsTabContentProps = {
  brandQuery: UseQueryResult<GetUserFavoriteBrandsQuery, unknown>
}

const BrandsTabContent = ({ brandQuery }: BrandsTabContentProps) => {
  return (
    <>
      {brandQuery.isFetching || brandQuery.isLoading ? (
        <BrandsOrSellersContainer>
          {() => (
            <>
              <BrandOrSellerCardSkeleton />
              <BrandOrSellerCardSkeleton />
              <BrandOrSellerCardSkeleton />
            </>
          )}
        </BrandsOrSellersContainer>
      ) : brandQuery.data?.favorites.brand.length ? (
        <BrandsOrSellersContainer>
          {({ selectedItemId, setSelectedItemId }) => (
            <>
              {brandQuery.data?.favorites.brand.map(
                (brand) =>
                  brand && (
                    <BrandOrSellerCard
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                      key={brand.id}
                      content={{ ...(brand as Brand), __typename: "Brand" }}
                    />
                  )
              )}
            </>
          )}
        </BrandsOrSellersContainer>
      ) : (
        <NotFoundItems text="برند" />
      )}
    </>
  )
}

export default BrandsTabContent
