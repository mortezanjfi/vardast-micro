"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { UseQueryResult } from "@tanstack/react-query"
import { ICategoryListLoader } from "@vardast/component/category/CategoryListLoader"
import Link from "@vardast/component/Link"
import { Banner, GetBannerHomePageQuery } from "@vardast/graphql/generated"
import useWindowSize from "@vardast/hook/use-window-size"
import { breakpoints } from "@vardast/tailwind-config/themes"
import clsx from "clsx"
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"

const chooseBannerImageSize = (banner: Banner, width: number) => {
  if (width >= breakpoints["2xl"]) {
    return banner.xlarge
  } else if (width >= breakpoints.md) {
    return banner.large
  } else if (width >= breakpoints.sm) {
    return banner.medium
  } else {
    return banner.small
  }
}

export const BulletSwiper = ({
  contentSize = 0,
  handleSlideTo = () => {},
  activeSlide = 0,
  className
}: {
  contentSize?: number
  handleSlideTo?: (_: number) => void
  activeSlide: number
  className?: string
}) => {
  return (
    <div
      className={clsx(
        "flex w-full justify-center py-6 sm:absolute sm:bottom-4 sm:z-20 sm:py-0",
        className
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center gap-x-1.5 sm:rounded-lg sm:border sm:border-alpha-100 sm:bg-alpha-50 sm:bg-opacity-40 sm:px-1 sm:py-0.5 sm:shadow-sm"
        )}
      >
        {[...Array(contentSize)]?.map((_, index) => (
          <span
            key={`home-slider-dot-${index}`}
            onClick={() => {
              handleSlideTo(index)
            }}
            className={`h-2 transform cursor-pointer rounded-full transition-all ${
              activeSlide === index ? "w-2 bg-primary" : "w-2 bg-alpha-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  )
}

const MobileHomeSlider = ({
  isMobileView,
  query
}: {
  query: UseQueryResult<GetBannerHomePageQuery, unknown>
  isMobileView: boolean
}) => {
  const { width } = useWindowSize()
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const sliderRef = useRef<SwiperRef>(null)

  const handleSlideTo = useCallback((index: number) => {
    if (!sliderRef.current) return
    sliderRef.current?.swiper.slideTo(index)
  }, [])

  useEffect(() => {
    if (sliderRef.current) {
      setActiveSlide(sliderRef.current?.swiper.realIndex)
    }
  }, [])

  const sliderClass =
    "h-[50vw] w-[calc(100vw-60px)] sm:h-[250px] sm:w-full sm:bg-alpha-100 md:h-[350px] 2xl:h-[500px] mx-auto"

  return (
    <div>
      <div className="overflow-hidden">
        {query.isLoading || query.isFetching || !width ? (
          <div className={clsx("animated-card", sliderClass)}></div>
        ) : (
          <Swiper
            ref={sliderRef}
            loop
            centeredSlides
            slidesPerView={isMobileView ? 1.2 : 1}
            onSlideChange={(swiper) => {
              setActiveSlide(swiper.realIndex)
            }}
            onAutoplay={(swiper) => {
              setActiveSlide(swiper.realIndex)
            }}
            modules={[Autoplay]}
            autoplay={{
              delay: 7000,
              disableOnInteraction: false
            }}
            className={clsx(
              "mx-auto h-full w-full sm:px-0",
              isMobileView ? "px-0" : "px-16"
            )}
            spaceBetween={15}
          >
            {query.data?.getBanners.map((banner) => {
              const responsiveImage = chooseBannerImageSize(
                banner as Banner,
                width
              )
              return (
                <SwiperSlide key={banner.id} className={sliderClass}>
                  <Link
                    onClick={() => {
                      responsiveImage.url && setSelectedItemId(banner.id)
                    }}
                    href={responsiveImage.url as string}
                  >
                    <Image
                      src={responsiveImage.presignedUrl.url}
                      alt="slider"
                      fill
                      className={clsx(
                        "h-full w-full rounded-xl border-2 object-cover sm:rounded-none sm:border-0",
                        responsiveImage.id,
                        selectedItemId === banner.id
                          ? "border-primary"
                          : "border-alpha-50"
                      )}
                    />
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}
      </div>
      {query.isLoading || query.isFetching ? (
        <div
          className={clsx(
            "flex w-full items-center justify-center gap-x-1.5 py-6 sm:absolute sm:bottom-4 sm:z-20 sm:py-0"
          )}
        >
          <div className="animated-card mx-auto h-3 w-14"></div>
        </div>
      ) : (
        <BulletSwiper
          activeSlide={activeSlide}
          contentSize={query.data?.getBanners.length}
          handleSlideTo={handleSlideTo}
        />
      )}
    </div>
  )
}

export default MobileHomeSlider
