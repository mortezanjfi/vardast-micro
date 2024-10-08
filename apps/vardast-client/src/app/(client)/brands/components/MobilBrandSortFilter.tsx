"use client"

import { Dispatch, SetStateAction, useContext } from "react"
import { ReadonlyURLSearchParams, useRouter } from "next/navigation"
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
  setSort: Dispatch<SetStateAction<SortBrandEnum>>
  sort: SortBrandEnum
  searchParams: ReadonlyURLSearchParams
  pathname: string
}

const MobilBrandSortFilter = ({
  setSort,
  sort,
  pathname,
  searchParams
}: MobilBrandSortFilterProps) => {
  const { push } = useRouter()
  const { sortFilterVisibilityAtom } = useContext(PublicContext)
  const [sortFilterVisibility, setSortFilterVisibility] = useAtom(
    sortFilterVisibilityAtom
  )

  const isTabletOrMobile = useMediaQuery("(max-width: 640px)", true, {
    getInitialValueInEffect: false
  })
  const onSortChanged = (sort: SortBrandEnum) => {
    setSort((prev) => {
      const isSortSelected = prev === sort
      const params = new URLSearchParams(searchParams as any)
      if (isSortSelected) {
        params.delete("orderBy")
      } else {
        params.set("orderBy", `${sort}`)
      }
      push(pathname + "?" + params.toString())
      return isSortSelected ? undefined : sort
    })
  }

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
                  iconOnly
                  size="small"
                  variant="ghost"
                  onClick={() => setSortFilterVisibility(false)}
                >
                  <LucideArrowRight className="h-5 w-5" />
                </Button>
                <div className="font-bold text-alpha-800">مرتب‌سازی</div>
              </div>
            </div>
            <div className="flex flex-col p-4">
              {Object.entries(sortBrand).map(([_, value]) => (
                <div className="flex h-16 gap-1">
                  <Checkbox
                    checked={sort === value.value}
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
                    onCheckedChange={() => {
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
