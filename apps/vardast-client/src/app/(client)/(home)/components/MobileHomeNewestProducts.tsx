"use client"

import { useState } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { ICategoryListLoader } from "@vardast/component/category/CategoryListLoader"
import MobileHomeSection from "@vardast/component/home/MobileHomeSection"
import ProductCard, {
  ProductCardSkeleton
} from "@vardast/component/product-card"
import ProductListContainer from "@vardast/component/ProductListContainer"
import SwiperNavigationButton, {
  SwiperButtonAction,
  SwiperButtonsDirection
} from "@vardast/component/SwiperNavigationButton"
import { GetAllProductsQuery, Product } from "@vardast/graphql/generated"
import clsx from "clsx"
import { useInView } from "react-intersection-observer"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperClass } from "swiper/types"

const MobileHomeNewestProducts = ({
  isMobileView,
  query,
  title,
  centeredSlides
}: {
  isMobileView?: boolean
  title: string
  centeredSlides?: boolean
  query: UseQueryResult<GetAllProductsQuery, unknown>
}) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>()
  const [selectedProduct, setSelectedProduct] =
    useState<ICategoryListLoader>(null)
  const { ref: refNext, inView: inViewNext } = useInView({ threshold: 0.1 })
  const { ref: refPrev, inView: inViewPrev } = useInView({ threshold: 0.1 })

  return (
    <MobileHomeSection bgWhite block title={title} viewAllHref="/products">
      {isMobileView ? (
        <div className="sm:pt-6">
          <ProductListContainer
            CardLoader={
              query.isLoading ? () => <ProductCardSkeleton /> : undefined
            }
          >
            {({ selectedItemId, setSelectedItemId }) => (
              <>
                {query.data?.products?.data
                  .slice(0, 12)
                  .map((product) => (
                    <ProductCard
                      key={product?.id}
                      product={product as Product}
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                    />
                  ))}
              </>
            )}
          </ProductListContainer>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          {!inViewNext && (
            <SwiperNavigationButton
              action={SwiperButtonAction.HANDLE_NEXT}
              direction={SwiperButtonsDirection.LEFT}
              iconSize={20}
              swiperRef={swiperRef}
            />
          )}
          <Swiper
            // freeMode={true}
            // pagination={{
            //   clickable: true
            // }}
            // modules={[FreeMode]}
            centeredSlides={centeredSlides ?? true}
            onSwiper={setSwiperRef}
            slidesPerView={"auto"}
            // spaceBetween={16}
            className="h-full w-full pb-12 sm:p-4 sm:px-5 sm:pt-8 md:px-0"
          >
            {query?.data?.products?.data?.map((product, index) => (
              <SwiperSlide className={clsx("w-72")} key={product.id}>
                <div
                  ref={
                    index === query?.data?.products?.data?.length - 1
                      ? refNext
                      : index === 0
                        ? refPrev
                        : undefined
                  }
                >
                  <ProductCard
                    key={product?.id}
                    product={product as Product}
                    selectedItemId={selectedProduct}
                    setSelectedItemId={setSelectedProduct}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {!inViewPrev && (
            <SwiperNavigationButton
              action={SwiperButtonAction.HANDLE_PREVIOUS}
              direction={SwiperButtonsDirection.RIGHT}
              iconSize={20}
              swiperRef={swiperRef}
            />
          )}
        </div>
      )}
      {/* <div className="sm:pt-6">
        <ProductListContainer
          CardLoader={
            allProductsQuery.isLoading
              ? () => <ProductCardSkeleton />
              : undefined
          }
        >
          {({ selectedItemId, setSelectedItemId }) => (
            <>
              {allProductsQuery.data?.products?.data
                .slice(0, 12)
                .map((product) => (
                  <ProductCard
                    selectedItemId={selectedItemId}
                    setSelectedItemId={setSelectedItemId}
                    key={product?.id}
                    product={product as Product}
                  />
                ))}
            </>
          )}
        </ProductListContainer>
      </div> */}
    </MobileHomeSection>
  )
}

export default MobileHomeNewestProducts
