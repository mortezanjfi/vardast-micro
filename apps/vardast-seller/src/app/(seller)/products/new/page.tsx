import withMobileHeader from "@vardast/component/withMobileHeader"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import ProductForm from "@/app/(seller)/products/new/ProductForm"

const ProductCreatePage = async () => {
  const isMobileView = CheckIsMobileView()
  return <ProductForm isMobile={isMobileView} />
}
export default withMobileHeader(ProductCreatePage, {
  title: "افزودن کالای جدید در وردست",
  hasBack: true
})
