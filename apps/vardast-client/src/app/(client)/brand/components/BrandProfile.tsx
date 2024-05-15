"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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
import BrandsOrSellersContainer, {
  BrandContainerType
} from "@vardast/component/BrandsOrSellersContainer"
import CategoryListContainer from "@vardast/component/category/CategoryListContainer"
import CategoryListItem from "@vardast/component/category/CategoryListItem"
import CategoriesSort, {
  CategoriesSortStatic
} from "@vardast/component/desktop/CategoriesSort"
import InfiniteScrollPagination from "@vardast/component/InfiniteScrollPagination"
import Link from "@vardast/component/Link"
import NoResult from "@vardast/component/NoResult"
import NotFoundMessage from "@vardast/component/NotFound"
import {
  Brand,
  EntityTypeEnum,
  File,
  GetAllCategoriesQuery,
  GetBrandQuery,
  GetBrandsOfSellerQuery,
  GetBrandToSellerQuery,
  GetIsFavoriteQuery,
  IndexProductInput,
  InputMaybe,
  Seller,
  SortBrandEnum
} from "@vardast/graphql/generated"
import { getAllCategoriesQueryFn } from "@vardast/query/queryFns/allCategoriesQueryFns"
import { getBrandQueryFn } from "@vardast/query/queryFns/brandQueryFns"
import { brandsOfSellerQueryFns } from "@vardast/query/queryFns/brandsOfSellerQueryFns"
import { getBrandToSellerQueryFns } from "@vardast/query/queryFns/getBrandToSellerQueryFns"
import { getIsFavoriteQueryFns } from "@vardast/query/queryFns/getIsFavoriteQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import {
  SegmentItemLoader,
  Segments,
  SegmentsList,
  SegmentsListItem
} from "@vardast/ui/segment"
import clsx from "clsx"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"

import BrandSort from "@/app/(client)/brands/components/BrandSort"
import SellersSort, {
  SellerSortStatic
} from "@/app/(client)/sellers/components/SellerSort"

import ProductList, { checkLimitPageByCondition } from "./ProductList"

export interface IBrandOrSellerProfile {
  limitPage?: number
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
  file?: File
  access_token?: string
  title: string
}

const sortContainerClass = clsx("flex items-center justify-between")

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
  isBrand = true,
  productsProps
}: {
  slug: Array<string | number>
  isBrand?: boolean
  productsProps: IBrandOrSellerProfile
}) => {
  // const [openTabName] = useQueryState("tab")
  // const pathname = usePathname()
  // const searchParams = useSearchParams()
  // const { push } = useRouter()

  const [sort, setSort] = useState<SellerSortStatic>(SellerSortStatic.Newest)
  const [brandSort, setBrandSort] = useState<SortBrandEnum>(
    SortBrandEnum.Newest
  )
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
      {(isBrand &&
        (brandToSellerQuery.isLoading || brandToSellerQuery.isFetching) &&
        !brandToSellerQuery.isFetchingNextPage) ||
      (!isBrand &&
        (brandsOfSellerQuery.isLoading || brandsOfSellerQuery.isFetching) &&
        !brandsOfSellerQuery.isFetchingNextPage) ? (
        <div
          className={clsx(
            "grid grid-cols-3 gap p pb-5 md:grid-cols-4 md:bg-alpha-white lg:grid-cols-5"
          )}
        >
          <BrandOrSellerCardSkeleton />
          <BrandOrSellerCardSkeleton />
          <BrandOrSellerCardSkeleton />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:gap-9 md:bg-alpha-white">
          {!productsProps.isMobileView && (
            <div className="sticky top-40 h-fit flex-shrink-0 border-2 border-alpha-200 bg-alpha-white px-4 py-4 md:w-[250px] md:min-w-[200px] md:rounded md:bg-inherit">
              <div className="flex flex-col gap-9">
                <div className=" flex items-center border-b-2 border-b-alpha-200 py-4">
                  <strong>فیلترها</strong>
                  {/* {filterAttributes.length > 0 && (
                    <Button
                      size="small"
                      noStyle
                      className="ms-auto text-sm text-red-500"
                      onClick={() => setFilterAttributes([])}
                    >
                      حذف همه فیلترها
                    </Button>
                  )} */}
                </div>
              </div>
            </div>
          )}
          <div className="flex w-full flex-col gap-9">
            {!productsProps.isMobileView && isBrand ? (
              <div className={sortContainerClass}>
                <BrandSort
                  sort={brandSort}
                  onSortChanged={(sort) => {
                    setBrandSort(sort)
                  }}
                />
                {!productsProps.isMobileView && (
                  <TotalItemsReport
                    total={
                      brandToSellerQuery.isLoading ||
                      brandToSellerQuery.isFetching
                        ? undefined
                        : brandToSellerQuery.data?.pages[0].takeBrandToSeller
                            .total
                    }
                    title="فروشندگان این برند"
                  />
                )}
              </div>
            ) : !productsProps.isMobileView && !isBrand ? (
              <div className={sortContainerClass}>
                <SellersSort
                  sort={sort}
                  onSortChanged={(sort) => {
                    setSort(sort)
                    console.log(sort)
                  }}
                />{" "}
                {!productsProps.isMobileView && (
                  <TotalItemsReport
                    total={
                      brandsOfSellerQuery.isLoading ||
                      brandsOfSellerQuery.isFetching
                        ? undefined
                        : brandsOfSellerQuery.data?.pages[0].brandsOfSeller
                            .total
                    }
                    title="برندهای این فروشنده"
                  />
                )}
              </div>
            ) : null}

            <BrandsOrSellersContainer
              type={BrandContainerType.Brand_Or_Seller_Profile}
            >
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
                                    page.takeBrandToSeller.data.length - 1 ===
                                    index
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
                                    page.brandsOfSeller.data.length - 1 ===
                                    index
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
          </div>
        </div>
      )}
    </>
  )
}

export const CategoriesTab = ({
  sellerName,
  isBrand = true,
  brandName,
  productsProps
}: {
  sellerName?: string
  isBrand?: boolean
  brandName?: string | undefined
  productsProps: IBrandOrSellerProfile
}) => {
  const [activeTab, setActiveTab] = useState<string>("")
  const sliderRef = useRef<HTMLDivElement>(null)
  const [slideWidth, setSlideWidth] = useState(0)
  const [sort, setSort] = useState<CategoriesSortStatic>(
    CategoriesSortStatic.Sum
  )

  const allCategoriesQuery = useInfiniteQuery<GetAllCategoriesQuery>(
    [
      QUERY_FUNCTIONS_KEY.ALL_CATEGORIES_QUERY_KEY,
      {
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] }),
        page: productsProps.args.page || 1
      }
    ],
    ({ pageParam = 1 }) => {
      return getAllCategoriesQueryFn({
        page: pageParam,
        ...(isBrand
          ? { brandId: +productsProps.slug[0] }
          : { sellerId: +productsProps.slug[0] })
      })
    },
    {
      keepPreviousData: true,
      getNextPageParam(lastPage, allPages) {
        return productsProps.limitPage
          ? checkLimitPageByCondition(
              lastPage.categories.currentPage <= productsProps.limitPage,
              allPages
            )
          : checkLimitPageByCondition(
              lastPage.categories.currentPage < lastPage.categories.lastPage,
              allPages
            )
      }
    }
    // enabled: openTabName === "CATEGORY"
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

  productsProps.args.categoryIds = [+activeTab]

  const dynamicHref = ({
    sellerName,
    sellerId,
    brandName,
    categoryId,
    categoryTitle,
    brandId
  }: {
    sellerId?: InputMaybe<number>
    sellerName?: string
    brandName?: string
    categoryId: number
    categoryTitle: string
    brandId?: InputMaybe<number>
  }) => {
    const baseUrl = `/products/${categoryId}/${categoryTitle}`
    const urlParams = new URLSearchParams()
    if (brandId && brandName) {
      urlParams.set("brandId", String(brandId))
      urlParams.set("brandName", brandName)
    }
    if (sellerId && sellerName) {
      urlParams.set("sellerId", String(sellerId))
      urlParams.set("sellerName", sellerName)
    }
    return `${baseUrl}?${urlParams.toString()}`
  }

  return (
    <Segments
      value={activeTab}
      onValueChange={onValueChange}
      className="h-full flex-col gap-9 sm:flex"
    >
      {productsProps.isMobileView ? (
        <>
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
                                  id === +activeTab
                                    ? "border-2 border-primary"
                                    : ""
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
          {/* <TotalItemsReport
            total={
              allCategoriesQuery.isLoading || allCategoriesQuery.isFetching
                ? undefined
                : allCategoriesQuery.data?.pages[0].categories.total
            }
            title="کالاهای این دسته بندی"
          /> */}
          <ProductList
            desktopSideBarClass={!productsProps.isMobileView ? "!top-0" : ""}
            isMobileView={productsProps.isMobileView}
            args={productsProps.args}
            selectedCategoryIds={[+activeTab]}
          />
        </>
      ) : (
        <>
          <div className={sortContainerClass}>
            <CategoriesSort
              sort={sort}
              onSortChanged={(sort) => {
                setSort(sort)
              }}
            />
            <TotalItemsReport
              total={
                allCategoriesQuery.isLoading || allCategoriesQuery.isFetching
                  ? undefined
                  : allCategoriesQuery.data?.pages[0].categories.total
              }
              title="دسته بندی های این برند"
            />
          </div>
          {allCategoriesQuery.isLoading && allCategoriesQuery.isFetching ? (
            <CategoryListContainer>
              {() => (
                <>
                  {[...Array(8)].map((_, index) => (
                    <div
                      key={`desktop-home-category-${index}`}
                      className="animated-card h-60 w-full"
                    ></div>
                  ))}
                </>
              )}
            </CategoryListContainer>
          ) : !allCategoriesQuery.data ? (
            <NoResult entity="category" />
          ) : allCategoriesQuery.data.pages.length ? (
            <CategoryListContainer>
              {({ selectedItemId, setSelectedItemId }) => (
                <InfiniteScrollPagination
                  CardLoader={() => (
                    <div className="animated-card h-60 w-full"></div>
                  )}
                  infiniteQuery={allCategoriesQuery}
                >
                  {(page, ref) => (
                    <>
                      {page.categories.data.map((category, index) => (
                        <CategoryListItem
                          key={category.id}
                          ref={
                            page.categories.data.length - 1 === index
                              ? ref
                              : undefined
                          }
                          productsCount={category.productsCount}
                          className="sm:max-h-60 sm:!min-h-full sm:min-w-full sm:!rounded-none sm:ring-2 sm:ring-alpha-200"
                          title={category?.title}
                          id={category.id}
                          selectedItemId={selectedItemId}
                          src={
                            (category &&
                              category?.imageCategory &&
                              (category?.imageCategory[0]?.file.presignedUrl
                                ?.url as string)) ??
                            "" ??
                            `/images/category/${category.id}.png`
                          }
                          // productsCount={category.}
                          onClick={() => setSelectedItemId(category.id)}
                          href={dynamicHref({
                            sellerId: productsProps.args["sellerId"],
                            sellerName: sellerName,
                            brandName: brandName,
                            brandId: productsProps?.args["brandId"],
                            categoryId: category.id,
                            categoryTitle: category.title
                          })}
                        />
                      ))}
                    </>
                  )}
                </InfiniteScrollPagination>
              )}
            </CategoryListContainer>
          ) : (
            <NotFoundMessage />
          )}
        </>
      )}
    </Segments>
  )
}

export const ProductsTab = ({
  // isBrand = true,
  productsProps
}: {
  isBrand?: boolean
  productsProps: IBrandOrSellerProfile
}) => {
  return (
    <ProductList
      isMobileView={productsProps.isMobileView}
      args={productsProps.args}
      selectedCategoryIds={[]}
      sellerId={productsProps.args.sellerId as number}
      brandId={productsProps.args.brandId as number}
    />
  )
}

const PdfTabItem = ({ file, access_token, title }: PdfTabItemProps) => {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-y-7 px py-9 sm:pt-0">
      {file && file.uuid ? (
        access_token ? (
          <>
            <h4 className="px-6 text-center">
              فایل PDF {title} را می توانید از گزینه زیر مشاهده نمایید.
            </h4>
            <div className="flex w-full items-center justify-center gap-3 sm:justify-between lg:flex-col">
              <div className="flex flex-col gap-2">
                {/* <div className=" hidden gap-1 sm:flex">
                  <div className="h-[64px] w-[64px]">
                    <Image
                      className="rounded-lg"
                      width={64}
                      height={64}
                      src={file.presignedUrl.url || "/public/images/blank.png"}
                      alt={file.name}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span>{file.originalName}</span>
                    <span>{digitsEnToFa(formatFileSize(file.size))}</span>
                  </div>
                </div> */}
                {/* <div className="hidden gap-1 sm:flex lg:items-center">
                  <span>تاریخ آپلود</span>
                  <span>
                    {file.createdAt
                      ? digitsEnToFa(
                          new Date(file.createdAt).toLocaleDateString("fa-IR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                          })
                        )
                      : ""}
                  </span>
                </div> */}
              </div>
              <div className="flex justify-end">
                {" "}
                <Link
                  download
                  target="_blank"
                  href={file.presignedUrl.url}
                  // loading={pdfViewLoading}
                  className="btn btn-primary btn-md flex items-center justify-center sm:px-4 sm:py-2"
                  // onClick={() => {
                  //   showPdfInNewTab({ uuid: file.uuid })
                  // }}
                >
                  <span>مشاهده {title}</span>
                </Link>
              </div>
            </div>
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
    () => getBrandQueryFn({ id: +slug[0] }),
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
            brandName={brandQuery.data?.brand.name}
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
            slug={slug} // brandToSellerQuery={brandToSellerQuery}
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
            title="لیست قیمت"
            file={brandQuery.data?.brand.priceList as File}
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
            title="کاتالوگ"
            file={brandQuery.data?.brand.catalog as File}
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
