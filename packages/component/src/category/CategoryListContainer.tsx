"use client"

import React, { ReactElement, useState } from "react"
import { clsx } from "clsx"

import Link from "../Link"
import { ICategoryListLoader } from "./CategoryListLoader"

interface ICategoryListContainer {
  isSubcategory?: boolean
  description?: string
  href?: string
  children(_: {
    selectedItemId: ICategoryListLoader
    setSelectedItemId: (_?: any) => void
  }): ReactElement
}

const CategoryListContainer: React.FC<ICategoryListContainer> = ({
  isSubcategory,
  description,
  href,
  children
}) => {
  const [more] = useState(false)
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  return (
    <>
      {description && (
        <>
          <div className="flex flex-col gap-y bg-alpha-white p">
            <h4 className="text-alpha-500">معرفی</h4>
            <div className={`${more ? "" : "line-clamp-2"}`}>
              {description.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-justify text-sm leading-6">
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              className="text-left text-primary"
              // onClick={() => {
              //   setMore(!more)
              // }}
              href={href || ""}
            >
              {more ? "کمتر" : "بیشتر"}
            </Link>
          </div>
        </>
      )}
      <ul
        className={clsx(
          "mt-6 grid grid-cols-2 gap-4 divide-alpha-200 p-6 pt-0 md:grid-cols-5 md:grid-rows-1",
          isSubcategory ? "grid-rows-4" : "grid-rows-2"
        )}
      >
        {children({ selectedItemId, setSelectedItemId })}
      </ul>
    </>
  )
}

export default CategoryListContainer
