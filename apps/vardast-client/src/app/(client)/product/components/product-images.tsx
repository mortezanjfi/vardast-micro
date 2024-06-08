"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import FavoriteIcon from "@vardast/component/FavoriteIcon"
import ShareIcon from "@vardast/component/ShareIcon"
import {
  EntityTypeEnum,
  GetIsFavoriteQuery,
  Product,
  Image as ProductImage
} from "@vardast/graphql/generated"
import { getIsFavoriteQueryFns } from "@vardast/query/queryFns/getIsFavoriteQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Button } from "@vardast/ui/button"
import { Dialog, DialogContent } from "@vardast/ui/dialog"
import clsx from "clsx"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import { Session } from "next-auth"
import { Navigation, Pagination, Thumbs, Zoom } from "swiper/modules"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"

import { BulletSwiper } from "@/app/(client)/(home)/components/MobileHomeSlider"

interface ProductImagesProps {
  isMobileView: boolean
  images: ProductImage[]
  product: Product
  session: Session | null
}

const ProductImages = ({
  images,
  isMobileView,
  product,
  session
}: ProductImagesProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const sliderRef = useRef<SwiperRef>(null)

  const isFavoriteQuery = useQuery<GetIsFavoriteQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_IS_FAVORITE,
      {
        entityId: product.id,
        type: EntityTypeEnum.Product,
        accessToken: session?.accessToken
      }
    ],
    () =>
      getIsFavoriteQueryFns({
        accessToken: session?.accessToken,
        entityId: product.id,
        type: EntityTypeEnum.Product
      }),
    {
      keepPreviousData: true,
      enabled: !!session
    }
  )

  const isBasketQuery = useQuery<GetIsFavoriteQuery>(
    [
      QUERY_FUNCTIONS_KEY.GET_IS_FAVORITE,
      {
        entityId: product.id,
        type: EntityTypeEnum.Basket,
        accessToken: session?.accessToken
      }
    ],
    () =>
      getIsFavoriteQueryFns({
        accessToken: session?.accessToken,
        entityId: product.id,
        type: EntityTypeEnum.Basket
      }),
    {
      keepPreviousData: true,
      enabled: !!session
    }
  )

  const handleSlideTo = useCallback((index: number) => {
    if (!sliderRef.current) return
    sliderRef.current?.swiper.slideTo(index)
  }, [])

  const handlePrevButton = (index: number) => {
    if (index < 0) {
      handleSlideTo(images.length - 1)
    } else if (index >= images.length) {
      handleSlideTo(0)
    } else {
      handleSlideTo(index)
    }
  }

  const handleNextButton = (index: number) => {
    if (index >= images.length) {
      // If index exceeds the last slide, loop back to the first slide
      handleSlideTo(0)
    } else {
      handleSlideTo(index)
    }
  }
  const handleClick = () => {
    // Call setImageModalOpen with the opposite value of imageModalOpen
    if (setImageModalOpen) {
      setImageModalOpen((prevState) => !prevState)
    } else return
  }

  const imagesContainerHeightClassName = clsx(
    "lg:h-[28rem] h-[30rem]",
    isMobileView ? "h-full" : ""
  )

  const imagesSlideClassName = { height: "h-[4rem]", width: "w-[5rem]" }

  return (
    <>
      {!isMobileView && (
        <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
          <DialogContent>
            <div className="relative z-0 h-full w-full overflow-hidden">
              <ChevronLeft
                className=" absolute left-0 top-1/2 z-20  text-primary"
                width={40}
                height={40}
                onClick={() => {
                  handlePrevButton(activeSlide - 1)
                }}
              />
              <Swiper
                ref={sliderRef}
                dir="rtl"
                spaceBetween={50}
                onSlideChange={(swiper) => {
                  setActiveSlide(swiper.realIndex)
                }}
                onAutoplay={(swiper) => {
                  setActiveSlide(swiper.realIndex)
                }}
                slidesPerView={1}
                loop={true}
                navigation={true}
                // thumbs={{ swiper: thumbsSwiper }}
                modules={[Pagination, Thumbs, Zoom, Navigation]}
                pagination={{
                  enabled: true,
                  dynamicBullets: true,
                  dynamicMainBullets: 4,
                  clickable: true
                }}
                zoom={{
                  maxRatio: 5
                }}
              >
                {images.map((image, idx) => (
                  <SwiperSlide key={idx} className=" rounded-lg bg-alpha-white">
                    <div
                      className={`${
                        isMobileView
                          ? " h-96"
                          : " swiper-zoom-container  h-[500px] w-[500px]"
                      }`}
                    >
                      <Image
                        src={image?.file.presignedUrl.url as string}
                        alt={image?.file.name as string}
                        fill
                        priority={idx === 0}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-contain "
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <ChevronRight
                className=" absolute right-0 top-1/2 z-20 text-primary"
                width={40}
                height={40}
                onClick={() => {
                  handleNextButton(activeSlide + 1)
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex h-fit w-full flex-col items-start justify-center gap-5 bg-alpha-white md:flex-row xl:sticky xl:top-[calc(theme('spacing.header')+theme('spacing.6'))] xl:mb-8 xl:w-[36.25rem]">
        {!isMobileView && images.length > 1 && (
          <div
            className={clsx(
              "hidden flex-col gap-2 overflow-hidden md:flex",
              imagesContainerHeightClassName,
              imagesSlideClassName.width
            )}
          >
            <Button
              variant="ghost"
              size="xsmall"
              onClick={() => {
                handlePrevButton(activeSlide - 1)
              }}
              className={clsx("shadow-custom", "rounded border-2")}
            >
              <ChevronUp className="h-4 w-4 text-alpha-500" />
            </Button>
            <Swiper
              //   @ts-ignore
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={"auto"}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[Thumbs]}
              direction="vertical"
              className={clsx("w-full overflow-hidden")}
            >
              {images.map((image, idx) => (
                <SwiperSlide
                  className={clsx(imagesSlideClassName.height)}
                  key={idx}
                >
                  <div
                    className={clsx(
                      "relative flex h-full w-full flex-col rounded-lg border-2",
                      activeSlide === idx && "border-2 border-primary"
                    )}
                  >
                    <Image
                      src={image.file.presignedUrl.url}
                      alt={image.file.name}
                      fill
                      className="h-full w-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <Button
              variant="ghost"
              size="xsmall"
              onClick={() => {
                handleNextButton(activeSlide + 1)
              }}
              className={clsx("shadow-custom", "rounded border-2")}
            >
              <ChevronDown className="h-4 w-4 text-alpha-500" />
            </Button>
          </div>
        )}
        <div
          className={clsx(
            "relative h-full w-full overflow-hidden",
            imagesContainerHeightClassName
          )}
        >
          <div className="absolute left top z-20 flex flex-col justify-end gap-x rounded-xl bg-alpha-white">
            <FavoriteIcon
              entityId={product.id}
              isFavoriteQuery={isFavoriteQuery}
              type={EntityTypeEnum.Product}
            />
            <FavoriteIcon
              entityId={product.id}
              isFavoriteQuery={isBasketQuery}
              type={EntityTypeEnum.Basket}
            />
            <ShareIcon name={product.name} />
          </div>

          <div className="relative h-full overflow-hidden">
            <Swiper
              ref={sliderRef}
              dir="rtl"
              spaceBetween={50}
              onSlideChange={(swiper) => {
                setActiveSlide(swiper.realIndex)
              }}
              onAutoplay={(swiper) => {
                setActiveSlide(swiper.realIndex)
              }}
              slidesPerView={1}
              className={clsx(
                "md:rounded-lg md:border-2",
                imagesContainerHeightClassName
              )}
              loop={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={isMobileView ? [] : [Pagination, Thumbs, Zoom]}
              pagination={
                isMobileView
                  ? {}
                  : {
                      enabled: true,
                      dynamicBullets: true,
                      dynamicMainBullets: 4,
                      clickable: true
                    }
              }
              zoom={{
                maxRatio: 5
              }}
            >
              {images.map((image, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    onClick={handleClick}
                    className={clsx(
                      isMobileView
                        ? "h-96 w-full"
                        : clsx("swiper-zoom-container h-full w-full")
                    )}
                  >
                    <Image
                      src={image.file.presignedUrl.url}
                      alt={image.file.name}
                      fill
                      priority={idx === 0}
                      // sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-contain "
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        {isMobileView && (
          <BulletSwiper
            activeSlide={activeSlide}
            contentSize={images.length}
            handleSlideTo={handleSlideTo}
            className="!py-0"
          />
        )}
        {/* {!isMobileView && (
        <div className=" flex flex-col justify-end gap-x rounded-xl bg-alpha-white">
          <FavoriteIcon
          entityId={product.id}
          isFavoriteQuery={isFavoriteQuery}
          type={EntityTypeEnum.Product}
          />
          <ShareIcon name={product.name} />
          </div>
        )} */}
      </div>
    </>
  )
}

export default ProductImages
