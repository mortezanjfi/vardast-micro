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
      blog={blog}
      description={description}
      getAllBlogsQuery={getAllBlogsQuery}
      href={href}
      isMobileView={isMobileView}
      isSubcategory={isSubcategory}
    >
      {({ selectedItemId, setSelectedItemId }) => (
        <>
          {data?.map(
            (category) =>
              category && (
                <CategoryListItem
                  href={`/category/${category.id}/${category.title}`}
                  id={category.id}
                  isSubCategory={isSubcategory}
                  key={category.id}
                  productsCount={category.productsCount}
                  selectedItemId={selectedItemId}
                  src={
                    (category &&
                      category?.imageCategory &&
                      (category?.imageCategory[0]?.file.presignedUrl
                        ?.url)) ??
                    "" ??
                    `/images/category/${category.id}.png`
                  }
                  title={category.title}
                  onClick={() => {
                    setSelectedItemId(category.id)
                  }}
                />
              )
          )}
        </>
      )}
    </CategoryListContainer>
  )
}

export default CategoriesList
