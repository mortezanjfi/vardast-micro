"use client"

import { useState } from "react"
import { GetCategoryQuery } from "@vardast/graphql/generated"

import CategoryListContainer from "@/app/(public)/(purchaser)/category/components/CategoryListContainer"
import CategoryListItem from "@/app/(public)/(purchaser)/category/components/CategoryListItem"
import { ICategoryListLoader } from "@/app/(public)/(purchaser)/category/components/CategoryListLoader"
import CategorySkeleton from "@/app/(public)/(purchaser)/category/components/CategorySkeleton"

interface CategoriesListProps {
  isLoading: boolean
  isSubcategory?: boolean
  description?: string
  href?: string
  data?: GetCategoryQuery["category"]["children"]
}

const CategoriesList = ({
  isLoading,
  description,
  href,
  data,
  isSubcategory
}: CategoriesListProps) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)

  if (isLoading) {
    return (
      <CategoryListContainer>
        <CategorySkeleton isSubCategory={isSubcategory} />
      </CategoryListContainer>
    )
  }

  return (
    <CategoryListContainer
      isSubcategory={isSubcategory}
      description={description}
      href={href}
    >
      {data?.map(
        (category) =>
          category && (
            <CategoryListItem
              isSubCategory={isSubcategory}
              onClick={() => {
                setSelectedItemId(category.id)
              }}
              href={
                category.childrenCount > 0
                  ? `/category/${category.id}/${category.title}`
                  : `/products/${category.id}/${category.title}`
              }
              selectedItemId={selectedItemId}
              key={category.id}
              title={category.title}
              productsCount={category.productsCount}
              id={category.id}
              src={
                (category &&
                  category?.imageCategory &&
                  (category?.imageCategory[0]?.file.presignedUrl
                    ?.url as string)) ??
                "" ??
                `/images/category/${category.id}.png`
              }
            />
          )
      )}
    </CategoryListContainer>
  )
}

export default CategoriesList
