"use client"

import { useContext } from "react"
import { useMediaQuery } from "@mantine/hooks"
import { sortBrand } from "@vardast/component/brand/BrandSortFilter"
import { SortBrandEnum } from "@vardast/graphql/generated"
import { PublicContext } from "@vardast/provider/PublicProvider"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import { Dialog, DialogContent } from "@vardast/ui/dialog"
import { useAtom } from "jotai"
import { LucideArrowRight } from "lucide-react"

type MobilBrandSortFilterProps = {
  onSortChanged: (_: SortBrandEnum) => void
  sort: SortBrandEnum
}

const MobilBrandSortFilter = ({
  sort,
  onSortChanged
}: MobilBrandSortFilterProps) => {
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
        <DialogContent className="h-full max-h-full w-screen max-w-screen rounded-none">
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
            <div className="flex flex-col p-4">
              {Object.entries(sortBrand).map(([key, value]) => (
                <div className="flex h-16 gap-1">
                  <Checkbox
                    className="flex
                    h-5
                    w-5
                    appearance-none
                    items-center
                    justify-center
                    rounded-md
                    border-2
                    border-alpha-200
                    bg-alpha-white
                    outline-none
                    data-[state='checked']:border-primary-500
                    data-[state='checked']:bg-primary-500"
                    checked={sort === value.value}
                    onCheckedChange={(checked) => {
                      onSortChanged(value.value)
                    }}
                  ></Checkbox>
                  <span className="inline-block leading-none">
                    {value.name_fa}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  )
}

export default MobilBrandSortFilter
