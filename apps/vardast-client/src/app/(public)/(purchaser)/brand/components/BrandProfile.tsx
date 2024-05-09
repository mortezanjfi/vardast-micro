"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import BrandOrSellerCard, {
  BrandOrSellerCardSkeleton
} from "@vardast/component/BrandOrSellerCard"
import BrandOrSellerProfile, {
  BrandOrSellerProfileTab,
  TabTitleWithExtraData
} from "@vardast/component/BrandOrSellerProfile"
import BrandsOrSellersContainer from "@vardast/component/BrandsOrSellersContainer"
import InfiniteScrollPagination from "@vardast/component/InfiniteScrollPagination"
import Link from "@vardast/component/Link"
import ProductCard, {
  ProductCardSkeleton
} from "@vardast/component/product-card"
import { checkLimitPageByCondition } from "@vardast/component/product-list"
import ProductListContainer from "@vardast/component/ProductListContainer"
import {
  Brand,
  EntityTypeEnum,
  GetAllCategoriesQuery,
  GetAllProductsQuery,
  GetBrandQuery,
  GetBrandsOfSellerQuery,
  GetBrandToSellerQuery,
  GetIsFavoriteQuery,
  IndexProductInput,
  Product,
  Seller
} from "@vardast/graphql/generated"
import axiosApis from "@vardast/query/queryClients/axiosApis"
import { getAllCategoriesQueryFn } from "@vardast/query/queryFns/allCategoriesQueryFns"
import { getAllProductsQueryFn } from "@vardast/query/queryFns/allProductsQueryFns"
import { getBrandQueryFn } from "@vardast/query/queryFns/brandQueryFns"
import { brandsOfSellerQueryFns } from "@vardast/query/queryFns/brandsOfSellerQueryFns"
import { getBrandToSellerQueryFns } from "@vardast/query/queryFns/getBrandToSellerQueryFns"
import { getIsFavoriteQueryFns } from "@vardast/query/queryFns/getIsFavoriteQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Button } from "@vardast/ui/button"
import {
  SegmentItemLoader,
  Segments,
  SegmentsContent,
  SegmentsList,
  SegmentsListItem
} from "@vardast/ui/segment"
import clsx from "clsx"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"

export interface IBrandOrSellerProfile {
  isMobileView: boolean
  slug: Array<string | number>
  args: IndexProductInput
  session: Session | null
}

export enum BrandProfileTabEnum {
  // eslint-disable-next-line no-unused-vars
  PRODUCT = "PRODUCT",
  // eslint-disable-next-line no-unused-vars
  CATEGORY = "CATEGORY",
  // eslint-disable-next-line no-unused-vars
  SELLERS = "SELLERS",
  // eslint-disable-next-line no-unused-vars
  PRICE_LIST = "PRICE_LIST",
  // eslint-disable-next-line no-unused-vars
  CATALOG = "CATALOG"
}

type PdfTabItemProps = {
  uuid?: string
  access_token?: string
  isMobileView?: boolean
  title: string
}

const TotalItemsReport = ({
  total,
  title
}: {
  total?: string | number
  title: string
}) => {
  return (
    <div className="flex items-center justify-start gap-x-2 px pt text-sm font-semibold text-primary">
      <span className="text-alpha-400">تعداد {title}:</span>
      {total ? digitsEnToFa(`${total}`) : "..."}
    </div>
  )
}

export const BrandOrSellersTab = ({
  slug,
  isBrand = true
}: {
  slug: Array<string | number>
  isBrand?: boolean
}) => {
  // const [openTabName] = useQueryState("tab")
  const brandToSellerQuery = useInfiniteQuery<GetBrandToSellerQuery>(
    [
      QUERY_FUNCTIONS_KEY.TAKE_BRAND_TO_SELLER,
      {
        page: 1,
        brandId: +slug[0]
      }
    ],
    ({ pageParam = 1 }) =>
      getBrandToSellerQueryFns({
        page: pageParam,
        brandId: +slug[0]
      }),
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return checkLimitPageByCondition(
          lastPage.takeBrandToSeller.currentPage <
            lastPage.takeBrandToSeller.lastPage,
          allPages
        )
      },
      enabled: !!isBrand
    }
  )

  const brandsOfSellerQuery = useInfiniteQuery<GetBrandsOfSellerQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_BRANDS_OF_SELLER,
      {
        page: 1,
        sellerId: +slug[0]
      }
    ],
    ({ pageParam = 1 }) => {
      return brandsOfSellerQueryFns({
        sellerId: +slug[0],
        page: pageParam
      })
    },
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return checkLimitPageByCondition(
          lastPage.brandsOfSeller.currentPage <
            lastPage.brandsOfSeller.lastPage,
          allPages
        )
      },
      enabled: !isBrand
    }
  )

  // const totalBrands = isBrand
  //   ? undefined
  //   : brandsOfSellerQuery.data?.pages.reduce(
  //       (prev, item) => prev + item.brandsOfSeller.total,
  //       0
  //     )

  return (
    <>
      {/* <TotalItemsReport
        total={
          isBrand
            ? brandToSellerQuery.data?.pages[0]?.takeBrandToSeller.total
            : totalBrands
        }
        title={isBrand ? "فروشندگان" : "برندها"}
      /> */}
      {(isBrand &&
        (brandToSellerQuery.isLoading || brandToSellerQuery.isFetching) &&
        !brandToSellerQuery.isFetchingNextPage) ||
      (!isBrand &&
        (brandsOfSellerQuery.isLoading || brandsOfSellerQuery.isFetching) &&
        !brandsOfSellerQuery.isFetchingNextPage) ? (
        <div
          className={clsx(
            "grid grid-cols-3 gap p pb-5 md:grid-cols-4 lg:grid-cols-5"
          )}
        >
          <BrandOrSellerCardSkeleton />
          <BrandOrSellerCardSkeleton />
          <BrandOrSellerCardSkeleton />
        </div>
      ) : (
        <BrandsOrSellersContainer>
          {({ selectedItemId, setSelectedItemId }) => (
            <>
              {isBrand ? (
                <InfiniteScrollPagination
                  CardLoader={BrandOrSellerCardSkeleton}
                  infiniteQuery={brandToSellerQuery}
                >
                  {(page, ref) => (
                    <>
                      {page.takeBrandToSeller.data.map(
                        (seller, index) =>
                          seller && (
                            <BrandOrSellerCard
                              ref={
                                page.takeBrandToSeller.data.length - 1 === index
                                  ? ref
                                  : undefined
                              }
                              key={seller.id}
                              selectedItemId={selectedItemId}
                              setSelectedItemId={setSelectedItemId}
                              content={{
                                ...(seller as Seller),
                                __typename: "Seller"
                              }}
                            />
                          )
                      )}
                    </>
                  )}
                </InfiniteScrollPagination>
              ) : (
                <InfiniteScrollPagination
                  CardLoader={BrandOrSellerCardSkeleton}
                  infiniteQuery={brandsOfSellerQuery}
                >
                  {(page, ref) => (
                    <>
                      {page.brandsOfSeller.data.map(
                        (brandsOfSeller, index) =>
                          brandsOfSeller && (
                            <BrandOrSellerCard
                              selectedItemId={selectedItemId}
                              setSelectedItemId={setSelectedItemId}
                              ref={
                                page.brandsOfSeller.data.length - 1 === index
                                  ? ref
                                  : undefined
                              }
                              key={brandsOfSeller.id}
                              content={{
                                ...(brandsOfSeller as Brand),
                                __typename: "Brand"
                              }}
                            />
                          )
                      )}
                    </>
                  )}
                </InfiniteScrollPagination>
              )}
            </>
          )}
        </BrandsOrSellersContainer>
      )}
    </>
  )
}

export const CategoriesTab = ({
  isBrand = true,
  productsProps
}: {
  isBrand?: boolean
  productsProps: IBrandOrSellerProfile
}) => {
  const [activeTab, setActiveTab] = useState<string>("")
  const sliderRef = useRef<HTMLDivElement>(null)
  const [slideWidth, setSlideWidth] = useState(0)

  const allCategoriesQuery = useInfiniteQuery<GetAllCategoriesQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.ALL_CATEGORIES_QUERY_KEY,
      {
        page: 1,
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] })
      }
    ],
    queryFn: ({ pageParam = 1 }) => {
      return getAllCategoriesQueryFn({
        page: pageParam,
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] })
      })
    },
    keepPreviousData: true,
    getNextPageParam(lastPage, allPages) {
      return checkLimitPageByCondition(
        lastPage.categories.currentPage < lastPage.categories.lastPage,
        allPages
      )
    }
    // enabled: openTabName === "CATEGORY"
  })

  const allProductsQuery = useInfiniteQuery<GetAllProductsQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
      {
        page: 1,
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] }),
        categoryIds: [activeTab]
      }
    ],
    ({ pageParam = 1 }) => {
      return getAllProductsQueryFn({
        page: pageParam,
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] }),
        categoryIds: [+activeTab]
      })
    },
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return checkLimitPageByCondition(
          lastPage.products.currentPage < lastPage.products.lastPage,
          allPages
        )
      },
      enabled: !!allCategoriesQuery.data && !!activeTab
    }
  )

  const onValueChange = (value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    const slide = sliderRef.current?.children[0]

    if (slide?.clientWidth) {
      setSlideWidth(slide?.clientWidth)
    }
  }, [allCategoriesQuery.data?.pages])

  useEffect(() => {
    const tempActiveTab =
      allCategoriesQuery.data?.pages[0].categories?.data?.at(0)?.id || ""

    if (tempActiveTab) {
      setActiveTab(`${tempActiveTab}`)
    }
  }, [allCategoriesQuery.data?.pages])

  return (
    <Segments
      value={activeTab}
      onValueChange={onValueChange}
      className="h-full bg-alpha-white"
    >
      {/* <TotalItemsReport
        total={allCategoriesQuery.data?.pages[0]?.categories?.total}
        title="دسته‌بندی‌ها"
      /> */}
      <SegmentsList className="border-b p">
        <InfiniteScrollPagination
          fetchingLoaderCount={6}
          CardLoader={() => <SegmentItemLoader />}
          infiniteQuery={allCategoriesQuery}
        >
          {(page, ref) => (
            <>
              {page.categories?.data?.map(
                ({ title, id, imageCategory }, index) => (
                  <SegmentsListItem
                    noStyle
                    ref={
                      page.categories.data.length - 1 === index
                        ? ref
                        : undefined
                    }
                    className="h-full pl"
                    key={id}
                    onClick={() => {
                      onValueChange(String(id))
                    }}
                    value={String(id)}
                  >
                    <>
                      <div
                        ref={sliderRef}
                        className={clsx(
                          "h-full w-[20vw] flex-shrink-0 cursor-pointer md:w-[100px]"
                        )}
                      >
                        <div
                          className={clsx(
                            "flex h-full flex-col justify-start gap-y-3"
                          )}
                        >
                          <div
                            style={{
                              height: slideWidth
                            }}
                            className={clsx(
                              "relative w-full overflow-hidden rounded-full border border-alpha-400 bg-alpha-50",
                              id === +activeTab ? "border-2 border-primary" : ""
                            )}
                          >
                            <Image
                              src={
                                (imageCategory &&
                                  (imageCategory[0]?.file.presignedUrl
                                    ?.url as string)) ??
                                "" ??
                                `/images/categories/${id}.png`
                              }
                              alt="category"
                              fill
                              className="rounded-xl object-contain"
                            />
                          </div>
                          <h5
                            className={clsx(
                              "relative z-20 line-clamp-2 h-12 whitespace-pre-wrap bg-opacity-60 text-center text-sm font-semibold",
                              id === +activeTab ? "text-primary" : ""
                            )}
                          >
                            {title}
                          </h5>
                        </div>
                      </div>
                    </>
                  </SegmentsListItem>
                )
              )}
            </>
          )}
        </InfiniteScrollPagination>
      </SegmentsList>

      {allCategoriesQuery.data?.pages.map((page) =>
        page.categories?.data?.map(({ id }) => (
          <SegmentsContent
            className={clsx("flex-1")}
            value={String(id)}
            key={id}
          >
            <TotalItemsReport
              total={
                allProductsQuery.isLoading || allProductsQuery.isFetching
                  ? undefined
                  : allProductsQuery.data?.pages[0]?.products.total
              }
              title="کالاهای این دسته‌بندی"
            />
            {(allProductsQuery.isLoading || allProductsQuery.isFetching) &&
            !allProductsQuery.isFetchingNextPage ? (
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : (
              <ProductListContainer>
                {({ selectedItemId, setSelectedItemId }) => (
                  <InfiniteScrollPagination
                    CardLoader={() => <ProductCardSkeleton />}
                    infiniteQuery={allProductsQuery}
                  >
                    {(page, ref) => (
                      <>
                        {page.products.data.map((product, index) => (
                          <ProductCard
                            selectedItemId={selectedItemId}
                            setSelectedItemId={setSelectedItemId}
                            ref={
                              page.products.data.length - 1 === index
                                ? ref
                                : undefined
                            }
                            key={product?.id}
                            product={product as Product}
                          />
                        ))}
                      </>
                    )}
                  </InfiniteScrollPagination>
                )}
              </ProductListContainer>
            )}
          </SegmentsContent>
        ))
      )}
    </Segments>
  )
}

export const ProductsTab = ({
  isBrand = true,
  productsProps
}: {
  isBrand?: boolean
  productsProps: IBrandOrSellerProfile
}) => {
  const allProductsQuery = useInfiniteQuery<GetAllProductsQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_PRODUCTS_QUERY_KEY,
      {
        page: 1,
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] })
      }
    ],
    ({ pageParam = 1 }) => {
      return getAllProductsQueryFn({
        page: pageParam,
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] })
      })
    },
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return checkLimitPageByCondition(
          lastPage.products.currentPage < lastPage.products.lastPage,
          allPages
        )
      }
    }
  )

  return (
    <>
      {/* <TotalItemsReport
        total={allProductsQuery.data?.pages[0]?.products.total}
        title="کالاها"
      /> */}
      {(allProductsQuery.isLoading || allProductsQuery.isFetching) &&
      !allProductsQuery.isFetchingNextPage ? (
        <>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </>
      ) : (
        <ProductListContainer>
          {({ selectedItemId, setSelectedItemId }) => (
            <InfiniteScrollPagination
              CardLoader={() => <ProductCardSkeleton />}
              infiniteQuery={allProductsQuery}
            >
              {(page, ref) => (
                <>
                  {page.products.data.map((product, index) => (
                    <ProductCard
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                      ref={
                        page.products.data.length - 1 === index
                          ? ref
                          : undefined
                      }
                      key={product?.id}
                      product={product as Product}
                    />
                  ))}
                </>
              )}
            </InfiniteScrollPagination>
          )}
        </ProductListContainer>
      )}
    </>
  )
}

const PdfTabItem = ({
  uuid,
  access_token,
  isMobileView,
  title
}: PdfTabItemProps) => {
  const [pdfViewLoading, setPdfViewLoading] = useState(false)

  const pathname = usePathname()

  const showPdfInNewTab = useCallback(
    async ({ uuid = "" }: { uuid: string }) => {
      setPdfViewLoading(true)
      const response = await axiosApis.servePdf({
        access_token,
        uuid
      })
      if (response.data) {
        setPdfViewLoading(false)
        const pdfBlob = new Blob([response.data], {
          type: "application/pdf"
        })
        const pdfUrl = URL.createObjectURL(pdfBlob)
        if (isMobileView) {
          window.location.href = pdfUrl
        } else {
          window.open(pdfUrl, "_blank")
        }
        URL.revokeObjectURL(pdfUrl)
      }
    },
    [isMobileView, access_token]
  )

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-y-7 px pt-14">
      {uuid ? (
        access_token ? (
          <>
            <h4 className="px-6 text-center">
              فایل PDF {title} را می توانید از گزینه زیر مشاهده نمایید.
            </h4>
            <Button
              loading={pdfViewLoading}
              className="btn btn-primary flex items-center justify-center"
              onClick={() => {
                showPdfInNewTab({ uuid })
              }}
            >
              <span>مشاهده {title}</span>
            </Button>
          </>
        ) : (
          <>
            <h4 className="px-6 text-center">
              برای مشاهده {title}، لطفا ابتدا وارد حساب کاربری خود شوید.
            </h4>
            <Link
              href={`/auth/signin${pathname}`}
              className="btn btn-md btn-primary block px"
            >
              ورود به حساب کاربری
            </Link>
          </>
        )
      ) : (
        <h4 className="px-6 text-center">
          در حال حاضر، {title}ی آپلود نشده است.
        </h4>
      )}
    </div>
  )
}

const BrandProfile = ({ isMobileView, args, slug }: IBrandOrSellerProfile) => {
  const { data: session } = useSession()

  const brandQuery = useQuery<GetBrandQuery>(
    [QUERY_FUNCTIONS_KEY.BRAND_QUERY_KEY, { id: +slug[0] }],
    () => getBrandQueryFn({ id: +slug[0], accessToken: session?.accessToken }),
    {
      keepPreviousData: true
    }
  )

  // const allCategoriesQuery = useQuery<GetAllCategoriesQuery>({
  //   queryKey: [
  //     QUERY_FUNCTIONS_KEY.ALL_CATEGORIES_QUERY_KEY,
  //     { brandId: +slug[0] }
  //   ],
  //   queryFn: () => getAllCategoriesQueryFn({ brandId: +slug[0] })
  // })

  const isFavoriteQuery = useQuery<GetIsFavoriteQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_IS_FAVORITE,
      {
        entityId: +slug[0],
        type: EntityTypeEnum.Brand
      }
    ],
    () =>
      getIsFavoriteQueryFns({
        accessToken: session?.accessToken,
        entityId: +slug[0],
        type: EntityTypeEnum.Brand
      }),
    {
      keepPreviousData: true,
      enabled: !!session
    }
  )

  // const brandToSellerQuery = useInfiniteQuery<GetBrandToSellerQuery>(
  //   [
  //     QUERY_FUNCTIONS_KEY.TAKE_BRAND_TO_SELLER,
  //     {
  //       page: 1,
  //       brandId: +slug[0]
  //     }
  //   ],
  //   ({ pageParam = 1 }) =>
  //     getBrandToSellerQueryFns({
  //       page: pageParam,
  //       brandId: +slug[0]
  //     }),
  //   {
  //     keepPreviousData: true,
  //     getNextPageParam(lastPage, allPages) {
  //       return checkLimitPageByCondition(
  //         lastPage.takeBrandToSeller.currentPage <
  //           lastPage.takeBrandToSeller.lastPage,
  //         allPages
  //       )
  //     }
  //   }
  // )

  const tabs: BrandOrSellerProfileTab[] = useMemo(
    () => [
      {
        value: BrandProfileTabEnum.PRODUCT,
        title: (
          <TabTitleWithExtraData
            title="کالاها"
            total={brandQuery.data?.brand.sum as number}
          />
        ),
        Content: () => {
          return (
            <ProductsTab
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
        value: BrandProfileTabEnum.CATEGORY,
        title: (
          <TabTitleWithExtraData
            title="دسته‌بندی‌ها"
            total={brandQuery.data?.brand.categoriesCount as number}
          />
        ),
        Content: () => (
          <CategoriesTab
            // query={allCategoriesQuery}
            productsProps={{
              args,
              isMobileView,
              session,
              slug
            }}
          />
        )
      },
      {
        value: BrandProfileTabEnum.SELLERS,
        className: "!bg-alpha-100 h-full",
        title: (
          <TabTitleWithExtraData
            title="فروشندگان"
            total={brandQuery.data?.brand.sellersCount as number}
          />
        ),
        Content: () => (
          <BrandOrSellersTab
            slug={slug}

            // brandToSellerQuery={brandToSellerQuery}
          />
        )
      },
      {
        value: BrandProfileTabEnum.PRICE_LIST,
        title: (
          <TabTitleWithExtraData
            title="لیست قیمت"
            createdDate={brandQuery.data?.brand.priceList?.createdAt}
          />
        ),
        Content: () => (
          <PdfTabItem
            access_token={session?.accessToken}
            isMobileView={isMobileView}
            title="لیست قیمت"
            uuid={brandQuery.data?.brand.priceList?.uuid}
          />
        )
      },
      {
        value: BrandProfileTabEnum.CATALOG,
        title: (
          <TabTitleWithExtraData
            title="کاتالوگ"
            createdDate={brandQuery.data?.brand.catalog?.createdAt}
          />
        ),
        Content: () => (
          <PdfTabItem
            access_token={session?.accessToken}
            isMobileView={isMobileView}
            title="کاتالوگ"
            uuid={brandQuery.data?.brand.catalog?.uuid}
          />
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [args, isMobileView, session, slug]
  )

  return (
    <BrandOrSellerProfile
      isMobileView={isMobileView}
      isFavoriteQuery={isFavoriteQuery}
      type={EntityTypeEnum.Brand}
      data={brandQuery.data?.brand}
      slug={slug}
      tabs={tabs}
    />
  )
}

export default BrandProfile
