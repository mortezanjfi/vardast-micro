import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

import ProductForm from "@/app/(seller)/products/new/ProductForm"

const ProductCreatePage = async () => {
  const isMobileView = await CheckIsMobileView()
  return <ProductForm isMobile={isMobileView} />
}
export default ProductCreatePage
