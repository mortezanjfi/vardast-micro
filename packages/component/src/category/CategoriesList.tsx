"use client"

import { UseQueryResult } from "@tanstack/react-query"
import { GetAllBlogsQuery, GetCategoryQuery } from "@vardast/graphql/generated"

import { setSidebar } from "../../../provider/src/LayoutProvider/use-layout"
import FiltersSidebarContainer from "../filters-sidebar-container"
import CategoryListContainer from "./CategoryListContainer"
import CategoryListItem from "./CategoryListItem"
import CategorySkeleton from "./CategorySkeleton"

interface CategoriesListProps {
  blog?: boolean
  getAllBlogsQuery?: UseQueryResult<GetAllBlogsQuery>
  isMobileView?: boolean
  isLoading: boolean
  isSubcategory?: boolean
  description?: string
  href?: string
  data?: GetCategoryQuery["category"]["children"]
}

const CategoriesList = ({
  blog,
  getAllBlogsQuery,
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

  const DesktopSidebar = <FiltersSidebarContainer />
  setSidebar(DesktopSidebar)
  return (
    <CategoryListContainer
      isMobileView={isMobileView}
      blog={blog}
      getAllBlogsQuery={getAllBlogsQuery}
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
                  href={`/category/${category.id}/${category.title}`}
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
