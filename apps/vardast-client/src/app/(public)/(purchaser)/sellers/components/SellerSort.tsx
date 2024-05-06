/* eslint-disable no-unused-vars */
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideSortDesc } from "lucide-react"

export enum SellerSortStatic {
  Newest = "NEWEST",
  Rating = "RATING",
  Sum = "SUM"
}

type SellersSortProps = {
  sort: SellerSortStatic
  onSortChanged: (_: SellerSortStatic) => void
}

const SellersSort = ({ sort, onSortChanged }: SellersSortProps) => {
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
              sort === SellerSortStatic.Newest
                ? "bg-primary font-bold text-alpha-white"
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(SellerSortStatic.Newest)}
          >
            جدیدترین
          </Button>
        </li>
        <li>
          <Button
            noStyle
            className={clsx([
              "rounded-lg px-3 py-2",
              sort === SellerSortStatic.Rating
                ? "bg-primary font-bold text-alpha-white"
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(SellerSortStatic.Rating)}
          >
            بالاترین امتیاز
          </Button>
        </li>
        <li>
          <Button
            noStyle
            className={clsx([
              "rounded-lg px-3 py-2",
              sort === SellerSortStatic.Sum
                ? "bg-primary font-bold text-alpha-white"
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(SellerSortStatic.Sum)}
          >
            بیشترین کالا
          </Button>
        </li>
      </ol>
    </div>
  )
}

export default SellersSort
