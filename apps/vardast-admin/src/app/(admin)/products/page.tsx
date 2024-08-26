import type { Metadata } from "next"

import Products from "./components/Products"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "کالاها"
  }
}

const ProductsIndex = async () => {
  return <Products title={(await generateMetadata()).title?.toString()} />
}

export default ProductsIndex
