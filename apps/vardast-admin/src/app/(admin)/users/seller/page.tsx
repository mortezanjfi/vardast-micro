import { Metadata } from "next"

import SellersPage from "@/app/(admin)/users/seller/components/SellersPage"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "فروشندگان"
  }
}

const SellersIndex = async () => {
  return (
    <SellersPage
      title={(await generateMetadata()).title?.toString() as string}
    />
  )
}

export default SellersIndex
