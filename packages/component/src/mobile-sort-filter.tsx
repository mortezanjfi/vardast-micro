"use client"

import { useContext } from "react"
import { useMediaQuery } from "@mantine/hooks"
import { ProductSortablesEnum } from "@vardast/graphql/generated"
import { PublicContext } from "@vardast/provider/PublicProvider"
import { Button } from "@vardast/ui/button"
import { Dialog, DialogContent } from "@vardast/ui/dialog"
import clsx from "clsx"
import { useAtom } from "jotai"
import { LucideArrowRight } from "lucide-react"

type MobileSortFilterProps = {
  sort: ProductSortablesEnum
  onSortChanged: (_: ProductSortablesEnum) => void
}

const MobileSortFilter = ({ sort, onSortChanged }: MobileSortFilterProps) => {
  const { sortFilterVisibilityAtom } = useContext(PublicContext)
  const [sortFilterVisibility, setSortFilterVisibility] = useAtom(
    sortFilterVisibilityAtom
  )

  const isTabletOrMobile = useMediaQuery("(max-width: 640px)", true, {
    getInitialValueInEffect: false
  })

  return (
    isTabletOrMobile && (
      <Dialog
        modal={false}
        open={sortFilterVisibility}
        onOpenChange={setSortFilterVisibility}
      >
        <DialogContent className="max-w-screen h-screen max-h-screen w-screen rounded-none">
          <div>
            <div className="sticky top-0 border-b border-alpha-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setSortFilterVisibility(false)}
                  variant="ghost"
                  size="small"
                  iconOnly
                >
                  <LucideArrowRight className="h-5 w-5" />
                </Button>
                <div className="font-bold text-alpha-800">مرتب‌سازی</div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-col divide-y divide-alpha-200">
                <Button
                  noStyle
                  className={clsx([
                    "py-3 text-start",
                    sort === ProductSortablesEnum.Newest
                      ? "font-bold text-primary-500"
                      : "text-alpha-700"
                  ])}
                  onClick={() => onSortChanged(ProductSortablesEnum.Newest)}
                >
                  جدیدترین
                </Button>
                <Button
                  noStyle
                  className={clsx([
                    "py-3 text-start",
                    sort === ProductSortablesEnum.MostAffordable
                      ? "font-bold text-primary-500"
                      : "text-alpha-700"
                  ])}
                  onClick={() =>
                    onSortChanged(ProductSortablesEnum.MostAffordable)
                  }
                >
                  ارزان‌ترین
                </Button>
                <Button
                  noStyle
                  className={clsx([
                    "py-3 text-start",
                    sort === ProductSortablesEnum.MostExpensive
                      ? "font-bold text-primary-500"
                      : "text-alpha-700"
                  ])}
                  onClick={() =>
                    onSortChanged(ProductSortablesEnum.MostExpensive)
                  }
                >
                  گران‌ترین
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  )
}

export default MobileSortFilter
