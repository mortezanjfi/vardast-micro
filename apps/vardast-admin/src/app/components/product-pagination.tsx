"use client"

import { Fragment } from "react"
import { usePagination } from "@mantine/hooks"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"

type ProductPaginationProps = {
  total: number
  currentPage: number
  onChange: (_: number) => void
}

const ProductPagination = ({
  total,
  currentPage,
  onChange
}: ProductPaginationProps) => {
  const pagination = usePagination({
    total,
    page: currentPage,
    onChange
  })

  return (
    <div className="mb-10 mt-8 text-center lg:mb-0">
      <div
        className="card
        mx-auto
        inline-flex
        items-stretch
        divide-x
        divide-x-reverse
        divide-alpha-200
        rounded-md
        text-xs
        md:text-sm
        [&>button:first-child]:rounded-r-md
        [&>button:last-child]:rounded-l-md"
      >
        <Button
          noStyle
          onClick={() => pagination.previous()}
          className="inline-flex cursor-pointer items-center justify-center bg-white px-2 text-alpha-700 hover:bg-alpha-50 md:px-3"
        >
          قبلی
        </Button>
        {pagination.range.map((page, idx) => (
          <Fragment key={idx}>
            {typeof page === "number" ? (
              <Button
                noStyle
                onClick={() => pagination.setPage(page)}
                className={clsx([
                  "inline-flex h-8 w-8 cursor-pointer items-center justify-center hover:bg-alpha-50 md:h-12 md:w-12",
                  page === pagination.active
                    ? "bg-alpha-50 font-bold text-alpha-800"
                    : "bg-white"
                ])}
              >
                {digitsEnToFa(page)}
              </Button>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center bg-white md:h-12 md:w-12">
                ...
              </span>
            )}
          </Fragment>
        ))}
        <Button
          noStyle
          onClick={() => pagination.next()}
          className="inline-flex cursor-pointer items-center justify-center bg-white px-2 hover:bg-alpha-50 md:px-3"
        >
          بعدی
        </Button>
      </div>
    </div>
  )
}

export default ProductPagination
