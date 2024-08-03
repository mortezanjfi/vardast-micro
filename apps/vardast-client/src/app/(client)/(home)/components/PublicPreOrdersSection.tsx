"use client"

import { useMemo, useState } from "react"
import { UseQueryResult } from "@tanstack/react-query/build/lib/types"
import SwiperNavigationButton, {
  SwiperButtonAction,
  SwiperButtonsDirection
} from "@vardast/component/SwiperNavigationButton"
import { GetPublicOrdersQuery } from "@vardast/graphql/generated"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperClass } from "swiper/types"

import PublicPreOrderCard from "@/app/(client)/(home)/components/PublicPreOrderCard"

type Props = {
  query: UseQueryResult<GetPublicOrdersQuery, unknown>
  isMobileView?: boolean
}

const flag = false

const PublicPreOrdersSection = ({ query, isMobileView }: Props) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>()

  const { ref: refNext, inView: inViewNext } = useInView({ threshold: 0.1 })
  const { ref: refPrev, inView: inViewPrev } = useInView({ threshold: 0.1 })

  const mappedData = useMemo(() => {
    let temp = []
    if (flag) {
      return query?.data?.publicOrders
    }
    query?.data?.publicOrders?.forEach((item) => {
      item.orders.map((bib) => {
        let temp2 = { ...item, ...bib }
        delete temp2.orders
        temp.push(temp2)
      })
    })

    return temp.sort(() => 0.5 - Math.random())
  }, [query?.data])

  return (
    query && (
      <div className="relative overflow-hidden sm:pb-4">
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
          className="px-4 pb-8 sm:!pb-4 sm:pt-8 md:px-0"
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
                  <div></div>
                </SwiperSlide>
              ))}
            </>
          ) : mappedData?.length ? (
            mappedData?.map(
              (data, index) =>
                data && (
                  <SwiperSlide
                    key={index}
                    className={clsx(
                      "ml-5 overflow-hidden bg-alpha-white md:!ml-0",
                      isMobileView ? "w-[calc(100vw-45px)]" : "w-[402px]"
                    )}
                  >
                    <div
                      ref={
                        index === mappedData?.length - 1
                          ? refNext
                          : index === 0
                            ? refPrev
                            : undefined
                      }
                    >
                      <PublicPreOrderCard data={data} />
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
