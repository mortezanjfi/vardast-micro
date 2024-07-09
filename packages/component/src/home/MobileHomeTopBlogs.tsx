"use client"

import { useState } from "react"
import Image from "next/image"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import { GetAllBlogsQuery } from "@vardast/graphql/generated"
import convertToPersianDate from "@vardast/util/convertToPersianDate"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperClass } from "swiper/types"

import { ICategoryListLoader } from "../category/CategoryListLoader"
import Link from "../Link"
import SwiperNavigationButton, {
  SwiperButtonAction,
  SwiperButtonsDirection
} from "../SwiperNavigationButton"
import MobileHomeSection from "./MobileHomeSection"

const MobileHomeTopBlogs = ({
  getAllBlogsQuery,
  isMobileView
}: {
  getAllBlogsQuery: UseQueryResult<GetAllBlogsQuery>
  isMobileView?: boolean
}) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)

  const [swiperRef, setSwiperRef] = useState<SwiperClass>()

  const { ref: refNext, inView: inViewNext } = useInView({ threshold: 0.1 })
  const { ref: refPrev, inView: inViewPrev } = useInView({ threshold: 0.1 })

  return (
    <MobileHomeSection
      viewAllHref="https://blog.vardast.com/"
      bgWhite
      title="جدیدترین اخبار و مطالب"
      block={true}
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
          onSwiper={setSwiperRef}
          key="blog-swiper"
          slidesPerView={"auto"}
          spaceBetween={15}
          className="px-4 pb-12 sm:pb-8 sm:pt-8 md:px-0"
        >
          {getAllBlogsQuery?.data?.getAllBlogs?.data?.map((blog, index) => (
            <SwiperSlide
              key={blog?.id}
              className={clsx(
                "overflow-hidden rounded-2xl border bg-alpha-white shadow-lg",
                isMobileView ? "w-[calc(100vw-45px)]" : "w-[350px]",
                selectedItemId === blog?.id
                  ? "border-2 border-primary"
                  : "border-alpha-50"
              )}
            >
              <div
                className="rounded-2xl"
                ref={
                  index === getAllBlogsQuery?.data?.getAllBlogs?.data.length - 1
                    ? refNext
                    : index === 0
                      ? refPrev
                      : undefined
                }
              >
                <Link
                  onClick={() => {
                    setSelectedItemId(blog?.id || 0)
                  }}
                  className={clsx("h-full w-full")}
                  href={blog?.url || "/"}
                >
                  <div
                    className={clsx(
                      "relative",
                      isMobileView ? "h-[50vw] w-full" : "h-[200px]"
                    )}
                  >
                    <Image
                      src={blog?.image_url || "/images/blank.png"}
                      alt="category"
                      fill
                      // width={400}
                      // height={300}
                      className="h-full w-full object-fill"
                    />
                  </div>
                  <div className="relative z-20 flex flex-col items-start justify-between gap-y-2 bg-alpha-white bg-opacity-60 px py-4 text-center">
                    <h4 className="w-full truncate text-justify font-semibold">
                      {blog?.title}
                    </h4>
                    <div className="w-full truncate text-justify text-alpha-500">
                      {blog?.date &&
                        digitsEnToFa(
                          convertToPersianDate({ dateString: blog.date })
                        )}
                      {/* <div
                      className="line-clamp-1"
                      dangerouslySetInnerHTML={{
                        __html: blog?.description || ""
                      }}
                    ></div> */}
                    </div>
                  </div>
                </Link>
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
        {/* {!isMobileView && <ShadowRectangle />} */}
      </div>
    </MobileHomeSection>
  )
}

export default MobileHomeTopBlogs
