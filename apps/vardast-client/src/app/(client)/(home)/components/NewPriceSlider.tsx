"use client"

import { useEffect, useRef, useState } from "react"
import { UseInfiniteQueryResult } from "@tanstack/react-query"
import { ICategoryListLoader } from "@vardast/component/category/CategoryListLoader"
import ProductCard from "@vardast/component/product-card"
import {
  Banner,
  GetAllProductsQuery,
  Product
} from "@vardast/graphql/generated"
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

const NewPriceSlider = ({
  query
}: {
  query: UseInfiniteQueryResult<GetAllProductsQuery, unknown>
}) => {
  const { width } = useWindowSize()
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const sliderRef = useRef<SwiperRef>(null)

  useEffect(() => {
    if (sliderRef.current) {
      setActiveSlide(sliderRef.current?.swiper.realIndex)
    }
  }, [])

  const sliderClass = " w-[calc(100vw-60px)] !ml-0 sm:w-full"

  return (
    <div className="pt-6 sm:relative sm:pt-0 ">
      <div className="overflow-hidden">
        {query.isLoading || query.isFetching || !width ? (
          <div className={clsx("animated-card", sliderClass)}></div>
        ) : (
          <Swiper
            ref={sliderRef}
            loop
            centeredSlides
            slidesPerView={4}
            onAutoplay={(swiper) => {
              setActiveSlide(swiper.realIndex)
            }}
            modules={[Autoplay]}
            autoplay={{
              delay: 0,
              disableOnInteraction: false
            }}
            speed={5000}
            className="h-full w-full divide-x-1 sm:px-0"
            // spaceBetween={15}
          >
            {query?.data?.pages[0]?.products?.data.map((product) => {
              return (
                <SwiperSlide key={product.id} className={sliderClass}>
                  <ProductCard
                    homeSlider={true}
                    key={product.id}
                    product={product as Product}
                  />
                </SwiperSlide>
              )
            })}
          </Swiper>
        )}
      </div>
      {/* {query.isLoading || query.isFetching ? (
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
      )} */}
    </div>
  )
}

export default NewPriceSlider
