"use client"

import { useEffect, useState } from "react"
import ProductCard from "@vardast/component/product-card"
import ProductListContainer from "@vardast/component/ProductListContainer"
import { Product } from "@vardast/graphql/generated"
import { getProductQueryFn } from "@vardast/query/queryFns/productQueryFns"
import { LucideLoader2, LucidePackageX } from "lucide-react"

const FavoritesComponent = () => {
  const [favoritesList, setFavoritesList] = useState<Product[]>([])
  const [pageLoading, setPageLoading] = useState(false)

  useEffect(() => {
    const favorites = localStorage.getItem("favorites")
    if (favorites) {
      setPageLoading(true)
      Promise.all(
        JSON.parse(favorites).map(async (favorite: string) => {
          const response = await getProductQueryFn(+favorite)
          setFavoritesList((prev: any) => [...prev, response.product])
        })
      ).then(() => {
        setPageLoading(false)
      })
    }
  }, [])

  return (
    <>
      {pageLoading ? (
        <div className="flex items-center justify-center p-12">
          <LucideLoader2 className="animate-spin text-alpha-400" />
        </div>
      ) : favoritesList.length > 0 ? (
        <ProductListContainer>
          {({ selectedItemId, setSelectedItemId }) => (
            <>
              {favoritesList.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedItemId={selectedItemId}
                  setSelectedItemId={setSelectedItemId}
                />
              ))}
            </>
          )}
        </ProductListContainer>
      ) : (
        <div className="relative mx-auto flex max-w-xs flex-col items-center py-8">
          <LucidePackageX className="mb-4 h-10 w-10 text-alpha-400" />
          <p className="mb-2 text-lg font-bold text-alpha-800">
            علاقه مندی یافت نشد
          </p>
        </div>
      )}
    </>
  )
}

export default FavoritesComponent
