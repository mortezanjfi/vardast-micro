import { ProductSortablesEnum } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideSortDesc } from "lucide-react"

interface ProductSortProps {
  sort: ProductSortablesEnum
  onSortChanged: (_: ProductSortablesEnum) => void
}

const ProductSort = ({ sort, onSortChanged }: ProductSortProps) => {
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
              sort === ProductSortablesEnum.Newest
                ? "bg-primary font-bold text-alpha-white"
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(ProductSortablesEnum.Newest)}
          >
            جدیدترین
          </Button>
        </li>
        <li>
          <Button
            noStyle
            className={clsx([
              "rounded-lg px-3 py-2",
              sort === ProductSortablesEnum.MostAffordable
                ? "bg-primary font-bold text-alpha-white"
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(ProductSortablesEnum.MostAffordable)}
          >
            ارزان‌ترین
          </Button>
        </li>
        <li>
          <Button
            noStyle
            className={clsx([
              "rounded-lg px-3 py-2",
              sort === ProductSortablesEnum.MostExpensive
                ? "bg-primary font-bold text-alpha-white"
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(ProductSortablesEnum.MostExpensive)}
          >
            گران‌ترین
          </Button>
        </li>
      </ol>
    </div>
  )
}

export default ProductSort
