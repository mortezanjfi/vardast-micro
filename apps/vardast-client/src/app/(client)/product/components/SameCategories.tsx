"use client"

import ProductSectionContainer from "@vardast/component/ProductSectionContainer"
import ProductSlider, {
  ProductSliderProps
} from "@vardast/component/ProductSlider"

const SameCategories = ({
  products,
  hasExtraItem,
  isMobileView
}: ProductSliderProps) => {
  return (
    <ProductSectionContainer
      spaceless
      title="کالاهای مشابه"
      TitleTag="h3"
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
