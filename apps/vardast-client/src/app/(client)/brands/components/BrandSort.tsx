import { SortBrandEnum } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideSortDesc } from "lucide-react"

type BrandSortProps = {
  sort: SortBrandEnum
  onSortChanged: (_: SortBrandEnum) => void
  bgColor?: string
}

const BrandSort = ({
  sort,
  onSortChanged,
  bgColor = "bg-primary"
}: BrandSortProps) => {
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
              sort === SortBrandEnum.Newest
                ? `${bgColor}  text-alpha-white`
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(SortBrandEnum.Newest)}
          >
            جدیدترین
          </Button>
        </li>
        <li>
          <Button
            noStyle
            className={clsx([
              "rounded-lg px-3 py-2",
              sort === SortBrandEnum.Rating
                ? `${bgColor}  text-alpha-white`
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(SortBrandEnum.Rating)}
          >
            بالاترین امتیاز
          </Button>
        </li>
        <li>
          <Button
            noStyle
            className={clsx([
              "rounded-lg px-3 py-2",
              sort === SortBrandEnum.Sum
                ? `${bgColor}  text-alpha-white`
                : "text-alpha-600"
            ])}
            onClick={() => onSortChanged(SortBrandEnum.Sum)}
          >
            بیشترین کالا
          </Button>
        </li>
      </ol>
    </div>
  )
}

export default BrandSort
