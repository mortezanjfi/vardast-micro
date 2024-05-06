"use client"

import { SearchSellerRepresentativeInput } from "@vardast/graphql/generated"
import { Session } from "next-auth"

import ProductList from "@/app/(seller)/products/components/product-list"
import ProductsHeader from "@/app/components/search-header"

interface ProductsPageProps {
  isMobileView: boolean
  slug: Array<string | number>
  args: SearchSellerRepresentativeInput

  session: Session | null
}

const ProductsPage = ({
  isMobileView,
  slug,
  args,
  session
}: ProductsPageProps) => {
  const selectedCategoryId = slug && slug.length > 0 ? +slug[0] : 0

  return (
    <>
      {slug && slug.length > 0 && (
        <ProductsHeader
          isMobileView={isMobileView}
          selectedCategoryId={+slug[0]}
        />
      )}
      <ProductList
        isMobileView={isMobileView}
        args={args}
        session={session}
        selectedCategoryIds={selectedCategoryId ? [selectedCategoryId] : null}
      />
    </>
  )
}

export default ProductsPage
