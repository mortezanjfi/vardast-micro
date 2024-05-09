"use client"

import { useState } from "react"
import SwiperNavigationButton, {
  SwiperButtonAction,
  SwiperButtonsDirection
} from "@vardast/component/SwiperNavigationButton"
import { Brand, Seller } from "@vardast/graphql/generated"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperClass } from "swiper/types"

import BigSliderItem from "@/app/(public)/(purchaser)/(home)/components/BigSliderItem"
import MobileHomeSection from "@/app/(public)/(purchaser)/(home)/components/MobileHomeSection"

export type QueryTypes = Seller[] | Brand[]

type Props<T extends QueryTypes> = {
  query?: T
  title: string
  __typename: "Seller" | "Brand"
  centeredSlides?: boolean
  isMobileView?: boolean
}

const MobileHomeTopEntities = <T extends QueryTypes>({
  query,
  title,
  centeredSlides,
  isMobileView,
  __typename
}: Props<T>) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>()

  const { ref: refNext, inView: inViewNext } = useInView({ threshold: 0.1 })
  const { ref: refPrev, inView: inViewPrev } = useInView({ threshold: 0.1 })

  return (
    <MobileHomeSection
      viewAllHref={`/${__typename?.toLowerCase()}s`}
      bgWhite
      title={title}
      block
    >
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
          centeredSlides={centeredSlides ?? true}
          slidesPerView={isMobileView ? 1.2 : "auto"}
          spaceBetween={16}
          className="h-full w-full pb-12 sm:px-5 sm:py-8 md:px-0"
        >
          {query?.map(
            (
              { id, bannerFile, logoFile, name, sum }: Seller | Brand,
              index: number
            ) => (
              <SwiperSlide
                key={id}
                className={clsx(!isMobileView && "w-[260px]")}
              >
                <div
                  ref={
                    index === query.length - 1
                      ? refNext
                      : index === 0
                        ? refPrev
                        : undefined
                  }
                >
                  <BigSliderItem
                    data={{
                      id,
                      name,
                      imageUrl: bannerFile?.presignedUrl.url ?? "",
                      avatarUrl: logoFile?.presignedUrl.url ?? "",
                      sum,
                      href: `/${__typename?.toLowerCase()}/${id}`
                    }}
                  />
                </div>
              </SwiperSlide>
            )
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
    </MobileHomeSection>
  )
}

export default MobileHomeTopEntities
