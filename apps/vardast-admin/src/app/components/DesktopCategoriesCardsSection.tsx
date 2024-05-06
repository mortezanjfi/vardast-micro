import { useState } from "react"
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import { UseQueryResult } from "@tanstack/react-query"
import { GetCategoryQuery } from "@vardast/graphql/generated"
import useWindowSize from "@vardast/hook/use-window-size"
import { breakpoints } from "@vardast/tailwind-config/themes"
import { ICategoryListLoader } from "@vardast/type/Loader"
import clsx from "clsx"

import CategoryListItem from "@/app/components/CategoryListItem"

type DesktopCategoriesCardsSectionProps = {
  selectedCategoryId: number
  getCategoryQuery: UseQueryResult<GetCategoryQuery, unknown>
}

const showHideMoreButton = (length: number, width: number) => {
  if (width >= breakpoints["2xl"]) {
    if (length >= 9) {
      return true
    }

    return false
  } else if (width >= breakpoints.xl) {
    if (length >= 7) {
      return true
    }

    return false
  } else if (width >= breakpoints.lg) {
    if (length >= 5) {
      return true
    }

    return false
  } else if (width >= breakpoints.md) {
    if (length >= 4) {
      return true
    }

    return false
  }

  return false
}

const DesktopCategoriesCardsSection = ({
  getCategoryQuery
  // selectedCategoryId
}: DesktopCategoriesCardsSectionProps) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  const { width } = useWindowSize()

  const [showMoreFlag, setShowMoreFlag] = useState(false)

  const toggleMoreClick = () => {
    setShowMoreFlag((prev) => !prev)
  }

  return (
    <>
      {getCategoryQuery.isLoading || getCategoryQuery.isFetching ? (
        <div className="relative hidden w-full md:block">
          <div className="hide-scrollbar relative flex items-stretch gap-3 overflow-x-hidden overflow-y-hidden rounded-2xl bg-alpha-50 px">
            {[...Array(8)].map((_, index) => (
              <div
                key={`desktop-home-category-${index}`}
                className="w-4h-44 h-44"
              ></div>
            ))}
          </div>
        </div>
      ) : getCategoryQuery.data?.category.children.length ? (
        <div className="relative hidden w-full flex-col gap-8 border-b-2 border-t-2 py-8 md:flex">
          <h3
            className={`font-medium md:text-xl`}
          >{`دسته‌بندی ${getCategoryQuery.data.category.title}`}</h3>
          <div
            className={clsx(
              "grid gap md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9",
              showMoreFlag
                ? ""
                : "justify-between md:[&>*:nth-child(-n+3)]:block lg:[&>*:nth-child(-n+4)]:block xl:[&>*:nth-child(-n+6)]:block 2xl:[&>*:nth-child(-n+8)]:block"
            )}
          >
            {getCategoryQuery.data.category.children.map(
              (children) =>
                children && (
                  <div
                    key={children.id}
                    className={clsx("h-44 w-full", !showMoreFlag && "hidden")}
                  >
                    <CategoryListItem
                      isSubCategory
                      className="!min-h-full min-w-full !rounded-2xl !bg-alpha-50 outline outline-1 outline-alpha-400 sm:max-h-full sm:max-w-full"
                      title={children?.title}
                      id={children.id}
                      selectedItemId={selectedItemId}
                      src={
                        (children &&
                          children?.imageCategory &&
                          (children?.imageCategory[0]?.file.presignedUrl
                            ?.url as string)) ??
                        "" ??
                        `/images/category/${children.id}.png`
                      }
                      productsCount={children.productsCount}
                      onClick={() => setSelectedItemId(children.id)}
                      href={encodeURI(
                        `/products/${children.id}/${children.title}`
                      )}
                    />
                  </div>
                )
            )}
            <div
              className={clsx(
                "btn h-44 w-full flex-col items-center justify-center rounded-2xl border border-alpha-400 bg-alpha-50 font-bold text-alpha-600",
                showHideMoreButton(
                  getCategoryQuery.data.category.children.length,
                  width
                )
                  ? "!flex"
                  : "!hidden"
              )}
              onClick={toggleMoreClick}
            >
              <span className="flex items-center gap-1">
                {showMoreFlag ? (
                  <>
                    <MinusCircleIcon className="h-8 w-8" />
                    نمایش کمتر
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="h-8 w-8" />
                    نمایش بیشتر
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default DesktopCategoriesCardsSection
