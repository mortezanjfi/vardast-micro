"use client"

import can from "@vardast/asset/images/banners/can.jpg"
import kasra from "@vardast/asset/images/banners/kasra.jpg"
import lg from "@vardast/asset/images/banners/lg.jpg"
import shoder from "@vardast/asset/images/banners/shoder.jpg"
import stealalborz from "@vardast/asset/images/banners/stealalborz.jpg"

import "swiper/css"
import "swiper/css/pagination"

import { CSSProperties } from "react"
import Image from "next/image"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

type Props = {}

const FrontPageSlider = (_: Props) => {
  return (
    <div className="mx-auto mt-12 max-w-[768px] overflow-hidden rounded-md">
      <Swiper
        style={
          {
            "--swiper-pagination-color": "#fff",
            "--swiper-pagination-bullet-inactive-color": "rgba(0,0,0,.3)",
            "--swiper-pagination-bullet-inactive-opacity": "1",
            "--swiper-pagination-bullet-size": "8px",
            "--swiper-pagination-bullet-horizontal-gap": "6px"
          } as CSSProperties
        }
        dir="rtl"
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        loop={true}
        pagination={true}
        modules={[Pagination, Autoplay]}
      >
        <SwiperSlide>
          <Image src={can} alt="هود کن" />
        </SwiperSlide>
        <SwiperSlide>
          <Image src={kasra} alt="شیرآلات کسری" />
        </SwiperSlide>
        <SwiperSlide>
          <Image src={lg} alt="ال جی" />
        </SwiperSlide>
        <SwiperSlide>
          <Image src={shoder} alt="شودر" />
        </SwiperSlide>
        <SwiperSlide>
          <Image src={stealalborz} alt="استیل البرز" />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default FrontPageSlider
