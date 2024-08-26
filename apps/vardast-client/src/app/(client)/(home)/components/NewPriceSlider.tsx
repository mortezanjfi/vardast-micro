"use client"

import { UseQueryResult } from "@tanstack/react-query"
import ProductCard from "@vardast/component/product-card"
import { GetAllProductsQuery, Product } from "@vardast/graphql/generated"
import useWindowSize from "@vardast/hook/use-window-size"
import clsx from "clsx"
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const NewPriceSlider = ({
  query
}: {
  query: UseQueryResult<GetAllProductsQuery, unknown>
}) => {
  const { width } = useWindowSize()
  const sliderClass = " w-[calc(100vw-60px)] !ml-0 sm:w-full"

  return (
    <div className=" pb-0 sm:relative sm:pt-0 ">
      <div className="overflow-hidden">
        {query.isLoading || query.isFetching || !width ? (
          <div className={clsx("animated-card", sliderClass)}></div>
        ) : (
          <Swiper
            autoplay={{
              delay: 0,
              disableOnInteraction: false
            }}
            centeredSlides
            key="new-price-slider"
            loop
            modules={[Autoplay]}
            slidesPerView={"auto"}
            speed={10000}
            className="h-full w-full sm:px-0"
            // spaceBetween={15}
          >
            {query?.data?.products?.data.map((product) => {
              return (
                <SwiperSlide
                  key={product.id}
                  className="w-fit"
                  // className={clsx("!w-[421px] min-w-[421px]")}
                >
                  <div>
                    <ProductCard
                      homeSlider={true}
                      key={product.id}
                      product={product as Product}
                    />
                  </div>
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
