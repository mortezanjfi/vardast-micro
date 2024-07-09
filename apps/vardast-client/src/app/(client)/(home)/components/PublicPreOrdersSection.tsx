"use client"

import { useState } from "react"
import { UseQueryResult } from "@tanstack/react-query/build/lib/types"
import { ICategoryListLoader } from "@vardast/component/category/CategoryListLoader"
import { OrderPreviewCardSkeleton } from "@vardast/component/order/OrderPreviewCard"
import SwiperNavigationButton, {
  SwiperButtonAction,
  SwiperButtonsDirection
} from "@vardast/component/SwiperNavigationButton"
import {
  GetPublicOrdersQuery,
  PublicPreOrderDto
} from "@vardast/graphql/src/generated"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperClass } from "swiper/types"

import PublicPreOrderCard from "@/app/(client)/(home)/components/PublicPreOrderCard"

type Props = {
  query: UseQueryResult<GetPublicOrdersQuery, unknown>
  isMobileView?: boolean
}

const PublicPreOrdersSection = ({ query, isMobileView }: Props) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>()
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  const { ref: refNext, inView: inViewNext } = useInView({ threshold: 0.1 })
  const { ref: refPrev, inView: inViewPrev } = useInView({ threshold: 0.1 })

  return (
    query && (
      <div className="relative overflow-hidden">
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
          // centeredSlides={centeredSlides ?? true}
          slidesPerView={"auto"}
          // className="h-full pb-12 sm:px-5 sm:py-8 md:px-0"
          className="rounded-xl border px-4 pb-12 sm:mt-8 sm:pb-0 md:px-0"
        >
          {query.isLoading || query.isFetching ? (
            <>
              {[...Array(10)].map((_, index) => (
                <SwiperSlide
                  key={index}
                  className={clsx(
                    "!ml-0 overflow-hidden bg-alpha-white",
                    isMobileView ? "w-[calc(100vw-45px)]" : "w-[402px]"
                  )}
                >
                  <OrderPreviewCardSkeleton />
                </SwiperSlide>
              ))}
            </>
          ) : query.data.publicOrders.length ? (
            query?.data?.publicOrders?.map(
              (data, index) =>
                data && (
                  <SwiperSlide
                    key={index}
                    className={clsx(
                      "!ml-0 overflow-hidden  bg-alpha-white",
                      isMobileView ? "w-[calc(100vw-45px)]" : "w-[402px]",
                      index !== query?.data?.publicOrders?.length - 1 &&
                        "border-l"
                    )}
                  >
                    <div
                      ref={
                        index === query?.data?.publicOrders?.length - 1
                          ? refNext
                          : index === 0
                            ? refPrev
                            : undefined
                      }
                    >
                      <PublicPreOrderCard data={data as PublicPreOrderDto} />
                    </div>
                  </SwiperSlide>
                )
            )
          ) : (
            ""
          )}
        </Swiper>
        {!inViewPrev && !isMobileView && (
          <SwiperNavigationButton
            swiperRef={swiperRef}
            action={SwiperButtonAction.HANDLE_PREVIOUS}
            direction={SwiperButtonsDirection.RIGHT}
            iconSize={20}
          />
        )}
      </div>
    )
  )
}

export default PublicPreOrdersSection
