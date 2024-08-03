"use client"

import React, { ReactElement, useEffect, useRef, useState } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { clsx } from "clsx"

import { GetAllBlogsQuery } from "../../../graphql/src/generated"
import MobileHomeTopBlogs from "../home/MobileHomeTopBlogs"
import { ICategoryListLoader } from "./CategoryListLoader"

interface ICategoryListContainer {
  isMobileView?: boolean
  blog?: boolean
  getAllBlogsQuery?: UseQueryResult<GetAllBlogsQuery>
  isSubcategory?: boolean
  description?: string
  href?: string
  children(_: {
    selectedItemId: ICategoryListLoader
    setSelectedItemId: (_?: any) => void
  }): ReactElement
}

const CategoryListContainer: React.FC<ICategoryListContainer> = ({
  isMobileView,
  blog,
  getAllBlogsQuery,
  isSubcategory,
  description,
  children
}) => {
  const [more, setMore] = useState(false)
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)

  //check if the description has more than 2 lines------>
  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current
      const isOverflowing = element.scrollHeight > element.clientHeight
      setIsOverflowing(isOverflowing)
    }
  }, [description])

  return (
    <>
      <ul
        className={clsx(
          !isSubcategory && "mt-6",
          "grid grid-cols-2 grid-rows-none gap-4 divide-alpha-200 p-6 pt-0 sm:!px-0 md:grid-cols-5 md:grid-rows-1"
        )}
      >
        {children({ selectedItemId, setSelectedItemId })}
      </ul>
      {blog && (
        <div className="border-t-2 bg-alpha-white">
          <div className="container mx-auto sm:py-8">
            <MobileHomeTopBlogs
              isMobileView={isMobileView}
              getAllBlogsQuery={getAllBlogsQuery}
            />
          </div>
        </div>
      )}
      {description && (
        <>
          <div className="flex flex-col gap-y border-t-2 px-6 py-8">
            <h4 className="text-alpha-500">معرفی</h4>
            <div
              ref={descriptionRef}
              className={`${more ? "" : "line-clamp-2"}`}
            >
              {description.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-justify text-sm leading-6">
                  {paragraph}
                </p>
              ))}
            </div>
            {isOverflowing && (
              <span
                className="cursor-pointer text-left text-primary"
                onClick={() => {
                  setMore(!more)
                }}
              >
                {more ? "کمتر" : "بیشتر"}
              </span>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default CategoryListContainer
