"use client"

import ProductSlider, {
  ProductSliderProps
} from "@vardast/component/ProductSlider"

import ProductSectionContainer from "@/app/(public)/(purchaser)/product/components/ProductSectionContainer"

const SameCategories = ({
  products,
  hasExtraItem,
  isMobileView
}: ProductSliderProps) => {
  return (
    <ProductSectionContainer
      spaceless
      title="کالاهای مشابه"
      // subtitle={{
      //   text: "مشاهده همه",
      //   onClick() {}
      // }}
    >
      <div
        className={`overflow-hidden bg-secondary py-6 sm:pl-2 ${
          !isMobileView && "rounded-2xl"
        }`}
      >
        <ProductSlider
          hasExtraItem={hasExtraItem}
          products={products}
          isMobileView={isMobileView}
        />
      </div>
    </ProductSectionContainer>
  )
}

export default SameCategories
