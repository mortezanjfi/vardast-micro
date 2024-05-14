"use client"

import { GetCategoryQuery } from "@vardast/graphql/generated"

import CategoryListContainer from "@/app/(client)/category/components/CategoryListContainer"
import CategoryListItem from "@/app/(client)/category/components/CategoryListItem"
import CategorySkeleton from "@/app/(client)/category/components/CategorySkeleton"

interface CategoriesListProps {
  isMobileView?: boolean
  isLoading: boolean
  isSubcategory?: boolean
  description?: string
  href?: string
  data?: GetCategoryQuery["category"]["children"]
}

const CategoriesList = ({
  isMobileView,
  isLoading,
  description,
  href,
  data,
  isSubcategory
}: CategoriesListProps) => {
  if (isLoading) {
    return (
      <CategoryListContainer>
        {() => <CategorySkeleton />}
      </CategoryListContainer>
    )
  }

  return (
    <CategoryListContainer
      isSubcategory={isSubcategory}
      description={description}
      href={href}
    >
      {({ selectedItemId, setSelectedItemId }) => (
        <>
          {data?.map(
            (category) =>
              category && (
                <CategoryListItem
                  isSubCategory={isSubcategory}
                  onClick={() => {
                    setSelectedItemId(category.id)
                  }}
                  href={
                    isMobileView && category.childrenCount > 0
                      ? `/category/${category.id}/${category.title}`
                      : isMobileView && category.childrenCount! > 0
                        ? `/products/${category.id}/${category.title}`
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
        </>
      )}
    </CategoryListContainer>
  )
}

export default CategoriesList
