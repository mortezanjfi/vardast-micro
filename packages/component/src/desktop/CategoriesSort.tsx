/* eslint-disable no-unused-vars */
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideSortDesc } from "lucide-react"

export enum CategoriesSortStatic {
  Newest = "NEWEST",
  Rating = "RATING",
  Sum = "SUM"
}

type CategoriesSortProps = {
  bgColor?: string
  sort: CategoriesSortStatic
  onSortChanged: (_: CategoriesSortStatic) => void
}

const CategoriesSort = ({
  sort,
  onSortChanged,
  bgColor = "bg-primary"
}: CategoriesSortProps) => {
  return (
    <div className="hidden items-center gap-7 md:flex">
      <div className="flex items-center">
        <LucideSortDesc className="h-5 w-5 text-alpha-400" />
        <span className="font-semibold text-alpha-700">مرتب سازی:</span>
      </div>
      <ol className="flex items-center gap-2">
        <li>
          <Button
            noStyle
            className={clsx([
              "rounded-lg px-3 py-2",
              sort === CategoriesSortStatic.Sum
                ? `${bgColor}  text-alpha-white`
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(CategoriesSortStatic.Sum)}
          >
            بیشترین کالا
          </Button>
        </li>
        <li>
          <Button
            noStyle
            className={clsx([
              "rounded-lg px-3 py-2",
              sort === CategoriesSortStatic.Newest
                ? `${bgColor}  text-alpha-white`
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(CategoriesSortStatic.Newest)}
          >
            جدیدترین
          </Button>
        </li>
        <li>
          <Button
            noStyle
            className={clsx([
              "rounded-lg px-3 py-2",
              sort === CategoriesSortStatic.Rating
                ? `${bgColor}  text-alpha-white`
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(CategoriesSortStatic.Rating)}
          >
            بالاترین امتیاز
          </Button>
        </li>
      </ol>
    </div>
  )
}

export default CategoriesSort
