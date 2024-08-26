"use client"

import { useContext, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import BrandOrSellerProfile, {
  BrandOrSellerProfileTab
} from "@vardast/component/BrandOrSellerProfile"
import {
  EntityTypeEnum,
  EventTrackerTypes,
  GetIsFavoriteQuery,
  GetSellerQuery
} from "@vardast/graphql/generated"
import { PublicContext } from "@vardast/provider/PublicProvider"
import { getIsFavoriteQueryFns } from "@vardast/query/queryFns/getIsFavoriteQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getSellerQueryFn } from "@vardast/query/queryFns/sellerQueryFns"
import { SegmentTabTitle } from "@vardast/ui/segment"
import { useSetAtom } from "jotai"

import BrandOrSellersTab from "../../brand/components/BrandOrSellersTab"
import { IBrandOrSellerProfile } from "../../brand/components/BrandProfile"
import CategoriesTab from "../../brand/components/CategoryTab"
import ProductsTab from "../../brand/components/ProductsTab"

export enum SellerProfileTabEnum {
   
  PRODUCT = "PRODUCT",
   
  CATEGORY = "CATEGORY",
   
  BRAND = "BRAND"
}

const SellerProfile = ({
  isMobileView,
  args,
  slug,
  session
}: IBrandOrSellerProfile) => {
  const { contactModalDataAtom } = useContext(PublicContext)
  const setContactModalData = useSetAtom(contactModalDataAtom)
  const query = useQuery<GetSellerQuery>(
    [QUERY_FUNCTIONS_KEY.SELLER_QUERY_KEY, { id: +slug[0] }],
    () => getSellerQueryFn({ id: +slug[0] }),
    {
      keepPreviousData: true
    }
  )

  const isFavoriteQuery = useQuery<GetIsFavoriteQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_IS_FAVORITE,
      { entityId: +slug[0], type: EntityTypeEnum.Seller }
    ],
    () =>
      getIsFavoriteQueryFns({
        accessToken: session?.accessToken,
        entityId: +slug[0],
        type: EntityTypeEnum.Seller
      }),
    {
      keepPreviousData: true,
      enabled: !!session
    }
  )

  const tabs: BrandOrSellerProfileTab[] = useMemo(
    () => [
      {
        value: SellerProfileTabEnum.PRODUCT,
        title: (
          <SegmentTabTitle title="کالاها" total={query.data?.seller.sum} />
        ),
        Content: () => {
          return (
            <ProductsTab
              isBrand={false}
              productsProps={{
                args,
                isMobileView,
                session,
                slug
              }}
            />
          )
        }
      },
      {
        value: SellerProfileTabEnum.CATEGORY,
        title: (
          <SegmentTabTitle
            title="دسته‌بندی‌ها"
            total={query.data?.seller.categoriesCount}
          />
        ),
        Content: () => (
          <CategoriesTab
            isBrand={false}
            productsProps={{
              args,
              isMobileView,
              session,
              slug
            }}
            sellerName={query.data?.seller.name}
          />
        )
      },
      {
        value: SellerProfileTabEnum.BRAND,
        className: "!bg-alpha-100 h-full",
        title: (
          <SegmentTabTitle
            title="برندها"
            total={query.data?.seller.brandsCount}
          />
        ),
        Content: () => (
          <BrandOrSellersTab
            isBrand={false}
            productsProps={{
              args,
              isMobileView,
              session,
              slug
            }}
            slug={slug}
          />
        )
      }
    ],
    [args, isMobileView, session, slug]
  )

  useEffect(() => {
    setContactModalData({
      data: query.data?.seller,
      type: EventTrackerTypes.ViewOffer,
      title: "اطلاعات تماس"
    })
  }, [query.data?.seller, setContactModalData])

  return (
    <BrandOrSellerProfile
      data={query.data?.seller}
      isFavoriteQuery={isFavoriteQuery}
      isMobileView={isMobileView}
      slug={slug}
      tabs={tabs}
      type={EntityTypeEnum.Seller}
    />
  )
}

export default SellerProfile
