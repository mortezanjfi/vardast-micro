"use client"

import { useState } from "react"
import BrandCard from "@vardast/component/brand/BrandCard"
import { ICategoryListLoader } from "@vardast/component/category/CategoryListLoader"
import MobileHomeSection from "@vardast/component/home/MobileHomeSection"
import SwiperNavigationButton, {
  SwiperButtonAction,
  SwiperButtonsDirection
} from "@vardast/component/SwiperNavigationButton"
import { Brand, GetAllBrandsCountQuery } from "@vardast/graphql/generated"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperClass } from "swiper/types"

type Props = {
  query?: GetAllBrandsCountQuery["brands"]["data"]
  title: string
  __typename: "Seller" | "Brand"
  isMobileView?: boolean
}

const MobileHomeTopEntities = ({
  query,
  title,
  isMobileView,
  __typename
}: Props) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>()
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
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
          // centeredSlides={centeredSlides ?? true}
          slidesPerView={"auto"}
          spaceBetween={15}
          // className="h-full pb-12 sm:px-5 sm:py-8 md:px-0"
          className="px-4 pb-12 sm:pb-8 sm:pt-8 md:px-0"
        >
          {query?.map((brand, index) => (
            <SwiperSlide
              key={brand.id}
              className={clsx(
                "overflow-hidden rounded-2xl bg-alpha-white",
                isMobileView ? "w-[calc(100vw-45px)]" : "w-[350px]",
                selectedItemId === brand?.id
                  ? "border-2 border-primary"
                  : "border-alpha-50"
              )}
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
                <BrandCard brand={brand as Brand} />
              </div>
            </SwiperSlide>
          ))}
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
