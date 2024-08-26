"use client"

import { Dispatch, SetStateAction, useContext } from "react"
import { useMediaQuery } from "@mantine/hooks"
import CategoryFilterSection from "@vardast/component/brand/CategoryFilterSection"
import CityFilterSection from "@vardast/component/brand/CityFilterSection"
import { IndexBrandInput } from "@vardast/graphql/generated"
import { PublicContext } from "@vardast/provider/PublicProvider"
import { Button } from "@vardast/ui/button"
import { Dialog, DialogContent } from "@vardast/ui/dialog"
import { Input } from "@vardast/ui/input"
import { useAtom } from "jotai"
import { LucideArrowRight } from "lucide-react"

type MobilBrandsFilterProps = {
  setBrandsQueryTemp: Dispatch<SetStateAction<string>>
  setBrandsQuery: (newValue: string) => void
  brandsQueryTemp: string
  setSelectedCategoryIds: Dispatch<SetStateAction<number[]>>
  selectedCategoryIds: number[]
  selectedCityId: number
  setSelectedCityId: Dispatch<SetStateAction<number>>
  args: IndexBrandInput
}

const MobilBrandsFilter = ({
  args,
  setBrandsQueryTemp,
  setBrandsQuery,
  brandsQueryTemp,
  setSelectedCategoryIds,
  selectedCategoryIds,
  selectedCityId,
  setSelectedCityId
}: MobilBrandsFilterProps) => {
  const { filtersVisibilityAtom } = useContext(PublicContext)
  const [filtersVisibility, setFiltersVisibility] = useAtom(
    filtersVisibilityAtom
  )

  const isTabletOrMobile = useMediaQuery("(max-width: 640px)", true, {
    getInitialValueInEffect: false
  })

  const removeFilters = () => {
    setBrandsQueryTemp("")
    setSelectedCategoryIds([])
    setSelectedCityId(null)
  }

  return (
    isTabletOrMobile && (
      <Dialog
        modal={false}
        open={filtersVisibility}
        onOpenChange={setFiltersVisibility}
      >
        <DialogContent className="h-full max-h-full w-screen max-w-screen rounded-none">
          <div>
            <div className="sticky top-0 border-b border-alpha-200 bg-white py-4">
              <div className="flex items-center gap-2">
                <Button
                  iconOnly
                  size="small"
                  variant="ghost"
                  onClick={() => setFiltersVisibility(false)}
                >
                  <LucideArrowRight className="h-5 w-5" />
                </Button>
                <div className="font-bold text-alpha-800">فیلترها</div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                className=" !p-0 text-sm text-error-500"
                disabled={!selectedCategoryIds?.length && !selectedCityId}
                type="button"
                variant="ghost"
                onClick={() => {
                  removeFilters()
                }}
              >
                حذف تمام فیلتر‌ها
              </Button>
            </div>

            <Input
              autoFocus
              className="my-4 flex  w-full
                          items-center
                          gap-2
                          rounded-lg
                          bg-alpha-100
                          px-4
                          py-3.5
                           focus:!ring-0 disabled:bg-alpha-100"
              placeholder="نام برند"
              type="text"
              value={brandsQueryTemp}
              onChange={(e) => {
                setBrandsQueryTemp(e.target.value)
                setBrandsQuery(e.target.value)
              }}
            />
            {/* args.categoryId means user is in the brand tab of a category */}
            {!args.categoryId && (
              <CategoryFilterSection
                openDefault
                selectedCategoryIds={selectedCategoryIds}
                setSelectedCategoryIds={setSelectedCategoryIds}
              />
            )}
            <CityFilterSection
              selectedCityId={selectedCityId}
              setSelectedCityId={setSelectedCityId}
            />
            {/* <div className="flex flex-col p-4">
              {Object.entries(sortBrand).map(([_, value]) => (
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
                    onCheckedChange={() => {}}
                  ></Checkbox>
                  <span className="inline-block leading-none">
                    {value.name_fa}
                  </span>
                </div>
              ))}
            </div> */}
          </div>
        </DialogContent>
      </Dialog>
    )
  )
}

export default MobilBrandsFilter
