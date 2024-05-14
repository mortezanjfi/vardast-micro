"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { UseQueryResult } from "@tanstack/react-query"
import Link from "@vardast/component/Link"
import SwiperNavigationButton, {
  SwiperButtonAction,
  SwiperButtonsDirection
} from "@vardast/component/SwiperNavigationButton"
import { GetAllSellersCountQuery } from "@vardast/graphql/generated"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperClass } from "swiper/types"

import MobileHomeSection from "@/app/(client)/(home)/components/MobileHomeSection"
import { ICategoryListLoader } from "@/app/(client)/category/components/CategoryListLoader"

type Props = {
  allSellersCount: UseQueryResult<GetAllSellersCountQuery>
  title: string
  isMobileView?: boolean
}

const circleSizes = {
  width: "w-[100px] min-w-[100px]",
  height: "h-[100px] min-h-[100px]",
  paddingTop: "pt-[50px]"
}

const smallCircleSizes = {
  width: "w-[50px]",
  height: "h-[50px]"
}

const HomeTopSellersLoading = () => {
  return (
    <div className="">
      <div className={clsx("h-full", circleSizes.paddingTop)}>
        <div
          className={clsx(
            "relative flex h-full flex-col justify-start rounded-2xl border bg-alpha-white shadow-lg",
            "border-alpha-200"
          )}
        >
          <div
            className={clsx(
              "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 bg-alpha-white"
            )}
          >
            <div
              className={clsx(
                "animated-card relative",
                circleSizes.height,
                circleSizes.width
              )}
            ></div>
          </div>

          <div
            className={clsx(
              "mt-6 flex flex-col items-center gap-y-2 pb-6",
              circleSizes.paddingTop
            )}
          >
            <div className="animated-card h-6 w-16 text-center font-semibold"></div>
            <div className="animated-card flex h-4 w-12 items-center gap-x-1 py-1 text-xs text-alpha-600"></div>
          </div>
          <div className="p pt-0">
            <p className="border-t py-8">
              <span className="animated-card inline-block h-4 w-20"></span>
            </p>
            <div
              className={clsx("grid flex-1 grid-cols-3 items-center gap-y py")}
            >
              {[...Array(3)].map((_, brand) => (
                <div
                  key={`top-home-sellers-loading-${brand}`}
                  className="relative z-20 flex flex-col items-center justify-between bg-opacity-60 text-center font-semibold"
                >
                  <div
                    className={clsx(
                      "animated-card relative overflow-hidden rounded-full border border-alpha-400",
                      smallCircleSizes.height,
                      smallCircleSizes.width
                    )}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const HomeTopSellers = ({
  allSellersCount,
  isMobileView = true,
  title
}: Props) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)

  const [swiperRef, setSwiperRef] = useState<SwiperClass>()

  const { ref: refNext, inView: inViewNext } = useInView({ threshold: 0.1 })
  const { ref: refPrev, inView: inViewPrev } = useInView({ threshold: 0.1 })

  const theSlides = useMemo(
    () => allSellersCount.data?.sellers.data?.slice(0, 8) || [],
    [allSellersCount.data?.sellers.data]
  )

  return (
    <MobileHomeSection viewAllHref="/sellers" bgWhite title={title} block>
      <div className="relative overflow-hidden">
        {!allSellersCount ||
        allSellersCount?.isLoading ||
        allSellersCount?.isFetching ? (
          <div className="hide-scrollbar inline-flex gap-x overflow-x-auto px-5 pb-12 md:px-0">
            {[...Array(7)].map((_, index) => (
              <div
                key={`Home-top-sellers-loading-${index}`}
                className={clsx(
                  isMobileView ? "w-[60vw]" : "w-[220px] max-w-[220px]"
                )}
              >
                <HomeTopSellersLoading />
              </div>
            ))}
          </div>
        ) : (
          <>
            {!inViewNext && !isMobileView && (
              <SwiperNavigationButton
                swiperRef={swiperRef}
                action={SwiperButtonAction.HANDLE_NEXT}
                direction={SwiperButtonsDirection.LEFT}
                iconSize={20}
              />
            )}
            <Swiper
              // freeMode={true}
              // pagination={{
              //   clickable: true
              // }}
              // modules={[FreeMode]}
              onSwiper={setSwiperRef}
              key="seller-swiper"
              slidesPerView={isMobileView ? 1.5 : "auto"}
              spaceBetween={16}
              className="h-full w-full px-5 pb-12 sm:py-8 md:px-0"
            >
              {theSlides.map((seller, index) => {
                if (seller) {
                  const { id, brands, logoFile, name, addresses } = seller
                  return (
                    <SwiperSlide
                      key={id}
                      className={clsx(!isMobileView && "w-[220px]")}
                    >
                      <Link
                        ref={
                          index === theSlides.length - 1
                            ? refNext
                            : index === 0
                              ? refPrev
                              : undefined
                        }
                        prefetch={false}
                        onClick={() => {
                          setSelectedItemId(id)
                        }}
                        href={`/seller/${id}`}
                      >
                        <div className={clsx("h-full", circleSizes.paddingTop)}>
                          <div
                            className={clsx(
                              "relative flex h-full flex-col justify-start rounded-2xl border bg-alpha-white shadow-lg",
                              selectedItemId === id
                                ? "border-2 border-primary"
                                : "border-alpha-200"
                            )}
                          >
                            <div
                              className={clsx(
                                "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 bg-alpha-white",
                                selectedItemId === id
                                  ? "border-2 border-primary"
                                  : ""
                              )}
                            >
                              <div
                                className={clsx(
                                  "relative",
                                  circleSizes.height,
                                  circleSizes.width
                                )}
                              >
                                <Image
                                  src={logoFile?.presignedUrl.url ?? ""}
                                  alt="category"
                                  fill
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            </div>

                            <div
                              className={clsx(
                                "mt-6 flex flex-col items-center gap-y-2 pb-6",
                                circleSizes.paddingTop
                              )}
                            >
                              <p className="text-center font-semibold">
                                {name || ""}
                              </p>
                              <p className="flex h-4 items-center gap-x-1 py-1 text-xs text-alpha-600">
                                <MapPinIcon className="h-3 w-3 text-alpha-600" />
                                {(addresses?.length > 0 &&
                                  addresses[0].city.name) ||
                                  "-"}
                              </p>
                            </div>
                            <div className="p pt-0">
                              <p className="border-t py pt-6 text-sm">
                                فروشنده برندهای:
                              </p>
                              <div
                                className={clsx(
                                  "grid flex-1 grid-cols-3 items-center gap-y py"
                                )}
                              >
                                {brands.slice(0, 3).map((brand) => (
                                  <div
                                    key={brand?.id}
                                    className="relative z-20 flex flex-col items-center justify-between bg-opacity-60 text-center font-semibold"
                                  >
                                    <div
                                      className={clsx(
                                        "relative overflow-hidden rounded-full border border-alpha-400",
                                        smallCircleSizes.height,
                                        smallCircleSizes.width
                                      )}
                                    >
                                      <Image
                                        src={
                                          brand?.logoFile?.presignedUrl.url ??
                                          "/images/seller-blank.png"
                                        }
                                        alt="category"
                                        fill
                                        className="h-full w-full rounded-full object-fill"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  )
                }
              })}
            </Swiper>
            {!inViewPrev && !isMobileView && (
              <SwiperNavigationButton
                swiperRef={swiperRef}
                action={SwiperButtonAction.HANDLE_PREVIOUS}
                direction={SwiperButtonsDirection.RIGHT}
                iconSize={20}
              />
            )}
          </>
        )}
        {/* {!isMobileView && <ShadowRectangle />} */}
      </div>
    </MobileHomeSection>
  )
}

export default HomeTopSellers
