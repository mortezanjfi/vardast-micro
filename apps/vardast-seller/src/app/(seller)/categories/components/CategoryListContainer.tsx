"use client"

import React, { PropsWithChildren, useState } from "react"
import Link from "@vardast/component/Link"

const CategoryListContainer: React.FC<
  PropsWithChildren<{
    isSubcategory?: boolean
    description?: string
    href?: string
  }>
> = ({ isSubcategory, description, href, children }) => {
  const [more] = useState(false)

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
        className={`grid grid-cols-2 md:grid-cols-5 ${
          isSubcategory
            ? "grid-rows-4 md:grid-rows-1"
            : "grid-rows-2 md:grid-rows-1"
        }  mt-6 gap-4 divide-alpha-200 p-6 pt-0`}
      >
        {children}
      </ul>
    </>
  )
}

export default CategoryListContainer
