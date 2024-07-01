"use client"

import { useEffect, useRef, useState } from "react"
import { UseInfiniteQueryResult } from "@tanstack/react-query"
import { ICategoryListLoader } from "@vardast/component/category/CategoryListLoader"
import ProductCard from "@vardast/component/product-card"
import { GetAllProductsQuery, Product } from "@vardast/graphql/generated"
import useWindowSize from "@vardast/hook/use-window-size"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import { Swiper as SwiperClass } from "swiper/types"

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

  const [swiperRef, setSwiperRef] = useState<SwiperClass>()

  const { ref: refNext, inView: inViewNext } = useInView({ threshold: 0.1 })
  const { ref: refPrev, inView: inViewPrev } = useInView({ threshold: 0.1 })

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
            loop
            centeredSlides
            slidesPerView={"auto"}
            onAutoplay={(swiper) => {
              setActiveSlide(swiper.realIndex)
            }}
            modules={[Autoplay]}
            autoplay={{
              delay: 0,
              disableOnInteraction: false
            }}
            speed={7000}
            className="h-full w-full divide-x-0.5 sm:px-0"
            // spaceBetween={15}
          >
            {query?.data?.pages[0]?.products?.data.map((product, index) => {
              return (
                <SwiperSlide
                  key={product.id}
                  className={clsx("!w-[421px] min-w-[421px]")}
                >
                  <div
                    ref={
                      index ===
                      query?.data?.pages[0]?.products?.data?.length - 1
                        ? refNext
                        : index === 0
                          ? refPrev
                          : undefined
                    }
                  >
                    <ProductCard
                      setSelectedItemId={setSelectedItemId}
                      selectedItemId={selectedItemId}
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
