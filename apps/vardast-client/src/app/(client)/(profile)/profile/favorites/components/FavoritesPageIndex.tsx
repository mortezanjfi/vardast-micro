"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  BrandOrSellerProfileTab,
  TabTitleWithExtraData
} from "@vardast/component/BrandOrSellerProfile"
import Loading from "@vardast/component/Loading"
import NotFoundIcon from "@vardast/component/not-found-icon"
import {
  EntityTypeEnum,
  GetUserFavoriteBrandsQuery,
  GetUserFavoriteProductsQuery,
  GetUserFavoriteSellersQuery
} from "@vardast/graphql/generated"
import { allUserFavoriteBrandsQueryFns } from "@vardast/query/queryFns/allUserFavoriteBrandsQueryFns"
import { allUserFavoriteProductsQueryFns } from "@vardast/query/queryFns/allUserFavoriteProductsQueryFns"
import { allUserFavoriteSellersQueryFns } from "@vardast/query/queryFns/allUserFavoriteSellersQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { useSession } from "next-auth/react"

import BrandsTabContent from "@/app/(client)/favorites/components/BrandsTabContent"
import FavoritesProfile from "@/app/(client)/favorites/components/FavoritesProfile"
import { ProductsTabContent } from "@/app/(client)/favorites/components/ProductsTabContent"
import { SellersTabContent } from "@/app/(client)/favorites/components/SellersTabContent"

export const NotFoundItems = ({ text = "کالا" }) => {
  return (
    <div className="flex flex-col justify-start gap-y-1">
      <NotFound text={text} />
      <NotFoundItemsHelp text={text} />
    </div>
  )
}

const NotFound = ({ text = "کالا" }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-7 bg-alpha-white px-6 py-10">
      <NotFoundIcon />
      <p className="text-center text-alpha-500">
        {`شما هنوز ${text} به لیست علاقمندی‌ها اضافه نکرده اید!`}
      </p>
    </div>
  )
}

const NotFoundItemsHelp = ({ text = "کالا" }) => {
  return (
    <div className="grid w-full grid-cols-6 items-center justify-center bg-alpha-white px-6 py-10">
      <div className="col-span-5 flex flex-col justify-evenly gap-y-1">
        <p className="text-right">نشان کنید!</p>
        <p className="text-right text-sm text-alpha-500">
          {`لیست دلخواه خود را بسازید و به راحتی ${text}های مورد نظر خود را پیدا
          کنید.`}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-12 w-12">
          <Image
            src="/favorite-gif.gif"
            alt="favorite-gif"
            fill
            className="object-fill"
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  )
}

const FavoritesPageIndex = ({ isMobileView }: { isMobileView: boolean }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  // const [type, setType] = useState<EntityTypeEnum>(EntityTypeEnum.Product)
  const [cacheFlag, setCacheFlag] = useState(false)
  // const router = useRouter()
  const productQuery = useQuery<GetUserFavoriteProductsQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_PRODUCT,
      EntityTypeEnum.Product
    ],
    queryFn: () =>
      allUserFavoriteProductsQueryFns({ accessToken: session?.accessToken }),
    refetchOnWindowFocus: true,
    enabled: !!session
  })
  const brandQuery = useQuery<GetUserFavoriteBrandsQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_BRAND,
      EntityTypeEnum.Brand
    ],
    queryFn: () =>
      allUserFavoriteBrandsQueryFns({ accessToken: session?.accessToken }),
    refetchOnWindowFocus: true,
    enabled: !!session
  })

  const sellerQuery = useQuery<GetUserFavoriteSellersQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.GET_ALL_USER_FAVORITE_SELLER,
      EntityTypeEnum.Seller
    ],
    queryFn: () =>
      allUserFavoriteSellersQueryFns({ accessToken: session?.accessToken }),
    refetchOnWindowFocus: true,
    enabled: !!session
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin/favorites")
    } else if (!cacheFlag) {
      brandQuery.refetch()
      sellerQuery.refetch()
      productQuery.refetch()
      setCacheFlag(true)
    }

    return () => {
      setCacheFlag(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   if (!session) {
  //     router.replace("/auth/signin")
  //   }

  //   if (!session?.profile?.roles.some((role) => role?.name === "seller")) {
  //     router.replace("/")
  //   }
  // }, [router, session])

  const tabs: BrandOrSellerProfileTab[] = useMemo(
    () => [
      {
        value: EntityTypeEnum.Product,
        title: <TabTitleWithExtraData title="کالاها" />,
        Content: () => (
          <ProductsTabContent session={session} productQuery={productQuery} />
        )
      },
      {
        value: EntityTypeEnum.Brand,
        title: <TabTitleWithExtraData title="برندها" />,
        Content: () => (
          <BrandsTabContent session={session} brandQuery={brandQuery} />
        )
      },
      {
        value: EntityTypeEnum.Seller,
        title: <TabTitleWithExtraData title="فروشندگان" />,
        Content: () => (
          <SellersTabContent sellerQuery={sellerQuery} session={session} />
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session]
  )

  if (status === "authenticated") {
    return (
      <FavoritesProfile tabs={tabs} isMobileView={isMobileView} />
      // <Tabs
      //   onValueChange={(value) => {
      //     setType(value as EntityTypeEnum)
      //   }}
      //   defaultValue="product"
      //   value={type}
      //   className="h-full"
      // >
      //   <TabsList className="w-full">
      //     <TabsTrigger
      //       className={clsx("w-1/2 bg-alpha-white !pb-3 !pt-5 font-semibold ")}
      //       value={EntityTypeEnum.Product}
      //     >
      //       <TabTitleWithExtraData
      //         title="کالاها"
      //         total={productQuery.data?.favorites.product.length}
      //       />
      //     </TabsTrigger>
      //     <TabsTrigger
      //       className={clsx("w-1/2 bg-alpha-white !pb-3 !pt-5 font-semibold ")}
      //       value={EntityTypeEnum.Seller}
      //     >
      //       <TabTitleWithExtraData
      //         title="فروشندگان"
      //         total={sellerQuery.data?.favorites.seller.length}
      //       />
      //     </TabsTrigger>
      //     <TabsTrigger
      //       className={clsx("w-1/2 bg-alpha-white !pb-3 !pt-5 font-semibold ")}
      //       value={EntityTypeEnum.Brand}
      //     >
      //       <TabTitleWithExtraData
      //         title="برندها"
      //         total={brandQuery.data?.favorites.brand.length}
      //       />
      //     </TabsTrigger>
      //   </TabsList>
      //   <TabsContent value={EntityTypeEnum.Product}>
      //     {(productQuery.isFetching || productQuery.isLoading) &&
      //     session?.accessToken ? (
      //       <ProductListContainer>
      //         {() => (
      //           <>
      //             <ProductCardSkeleton />
      //             <ProductCardSkeleton />
      //             <ProductCardSkeleton />
      //           </>
      //         )}
      //       </ProductListContainer>
      //     ) : productQuery.data?.favorites.product.length ? (
      //       <ProductListContainer>
      //         {({ selectedItemId, setSelectedItemId }) => (
      //           <>
      //             {productQuery.data?.favorites.product.map(
      //               (product) =>
      //                 product && (
      //                   <ProductCard
      //                     selectedItemId={selectedItemId}
      //                     setSelectedItemId={setSelectedItemId}
      //                     key={product.id}
      //                     product={product as Product}
      //                   />
      //                 )
      //             )}
      //           </>
      //         )}
      //       </ProductListContainer>
      //     ) : (
      //       <NotFoundItems text="کالا" />
      //     )}
      //   </TabsContent>
      //   <TabsContent value={EntityTypeEnum.Seller}>
      //     {(sellerQuery.isFetching || sellerQuery.isLoading) &&
      //     session?.accessToken ? (
      //       <BrandsOrSellersContainer>
      //         {() => (
      //           <>
      //             <BrandOrSellerCardSkeleton />
      //             <BrandOrSellerCardSkeleton />
      //             <BrandOrSellerCardSkeleton />
      //           </>
      //         )}
      //       </BrandsOrSellersContainer>
      //     ) : sellerQuery.data?.favorites.seller.length ? (
      //       <BrandsOrSellersContainer>
      //         {({ selectedItemId, setSelectedItemId }) => (
      //           <>
      //             {sellerQuery.data?.favorites.seller.map(
      //               (seller) =>
      //                 seller && (
      //                   <BrandOrSellerCard
      //                     selectedItemId={selectedItemId}
      //                     setSelectedItemId={setSelectedItemId}
      //                     key={seller.id}
      //                     content={{
      //                       ...(seller as Seller),
      //                       __typename: "Seller"
      //                     }}
      //                   />
      //                 )
      //             )}
      //           </>
      //         )}
      //       </BrandsOrSellersContainer>
      //     ) : (
      //       <NotFoundItems text="فروشنده‌" />
      //     )}
      //   </TabsContent>
      //   <TabsContent value={EntityTypeEnum.Brand}>
      //     {(brandQuery.isFetching || brandQuery.isLoading) &&
      //     session?.accessToken ? (
      //       <BrandsOrSellersContainer>
      //         {() => (
      //           <>
      //             <BrandOrSellerCardSkeleton />
      //             <BrandOrSellerCardSkeleton />
      //             <BrandOrSellerCardSkeleton />
      //           </>
      //         )}
      //       </BrandsOrSellersContainer>
      //     ) : brandQuery.data?.favorites.brand.length ? (
      //       <BrandsOrSellersContainer>
      //         {({ selectedItemId, setSelectedItemId }) => (
      //           <>
      //             {brandQuery.data?.favorites.brand.map(
      //               (brand) =>
      //                 brand && (
      //                   <BrandOrSellerCard
      //                     selectedItemId={selectedItemId}
      //                     setSelectedItemId={setSelectedItemId}
      //                     key={brand.id}
      //                     content={{ ...(brand as Brand), __typename: "Brand" }}
      //                   />
      //                 )
      //             )}
      //           </>
      //         )}
      //       </BrandsOrSellersContainer>
      //     ) : (
      //       <NotFoundItems text="برند" />
      //     )}
      //   </TabsContent>
      // </Tabs>
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loading message="لطفا منتظر بمانید..." />
    </div>
  )
}

export default FavoritesPageIndex
