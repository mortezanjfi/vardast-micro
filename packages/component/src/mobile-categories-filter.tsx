"use client"

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as Label from "@radix-ui/react-label"
import { useQuery } from "@tanstack/react-query"
import {
  Category,
  GetAllCategoriesQuery,
  GetCategoryQuery,
  GetVocabularyQuery,
  IndexCategoryInput,
  InputMaybe
} from "@vardast/graphql/generated"
import { PublicContext } from "@vardast/provider/PublicProvider"
import { getAllCategoriesQueryFn } from "@vardast/query/queryFns/allCategoriesQueryFns"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { getVocabularyQueryFn } from "@vardast/query/queryFns/vocabularyQueryFns"
import { RequireAtLeastOne } from "@vardast/type/RequireAtLeastOne"
import { Button } from "@vardast/ui/button"
import { Dialog, DialogContent } from "@vardast/ui/dialog"
import { useAtom } from "jotai"
import { LucideArrowRight, LucideCheck, LucideChevronLeft } from "lucide-react"

interface VocabulariesListProps {
  onCategoryChanged: (_: Category) => void
}

const VocabulariesList = ({ onCategoryChanged }: VocabulariesListProps) => {
  const vocabularies = useQuery<GetVocabularyQuery>({
    queryKey: [
      QUERY_FUNCTIONS_KEY.VOCABULARY_QUERY_KEY,
      { slug: "product_categories" }
    ],
    queryFn: () => getVocabularyQueryFn("product_categories")
  })

  if (vocabularies.isLoading)
    return (
      <div className="flex animate-pulse flex-col gap-3">
        <div className="h-8 w-[80%] rounded-md bg-alpha-200"></div>
        <div className="h-8 w-full rounded-md bg-alpha-200"></div>
        <div className="h-8 w-[90%] rounded-md bg-alpha-200"></div>
      </div>
    )
  if (!vocabularies.data) return <></>

  return (
    <ul className="flex flex-col divide-y divide-alpha-200">
      {vocabularies.data.vocabulary.categories.map(
        (category) =>
          category && (
            <li
              key={category.id}
              className="flex items-center justify-between py-3"
              onClick={() => onCategoryChanged(category as Category)}
            >
              {category.title}
              {category.childrenCount > 0 && (
                <LucideChevronLeft className="h-4 w-4 text-alpha-400" />
              )}
            </li>
          )
      )}
    </ul>
  )
}

interface CategoriesListProps {
  categoryId: number
  onCategoryChanged: (_: Category, __: boolean) => void
  onMounted: (_: Category) => void
}

const CategoriesList = ({
  onCategoryChanged,
  onMounted,
  categoryId
}: CategoriesListProps) => {
  const categoriesQuery = useQuery<GetCategoryQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.CATEGORY_QUERY_KEY, { id: categoryId }],
    queryFn: () => getCategoryQueryFn(categoryId)
  })

  useEffect(() => {
    if (categoriesQuery.data) {
      onMounted(categoriesQuery.data.category as Category)
    }
  }, [categoriesQuery, onMounted])

  if (categoriesQuery.isLoading)
    return (
      <div className="flex animate-pulse flex-col gap-3">
        <div className="h-8 w-[80%] rounded-md bg-alpha-200"></div>
        <div className="h-8 w-full rounded-md bg-alpha-200"></div>
        <div className="h-8 w-[90%] rounded-md bg-alpha-200"></div>
      </div>
    )
  if (!categoriesQuery.data) return <></>

  const data = categoriesQuery.data

  return (
    <ul className="flex flex-col divide-y divide-alpha-200">
      <li
        className="flex items-center justify-between py-3 font-medium"
        onClick={() => onCategoryChanged(data.category as Category, true)}
      >
        {`نمایش تمام کالاهای ${data.category.title}`}
      </li>
      {data.category.children.map(
        (category) =>
          category && (
            <li
              key={category.id}
              className="flex items-center justify-between py-3"
              onClick={() => onCategoryChanged(category as Category, false)}
            >
              {category.title}
              {category.childrenCount > 0 && (
                <LucideChevronLeft className="h-4 w-4 text-alpha-400" />
              )}
            </li>
          )
      )}
    </ul>
  )
}

interface BrandOrSellerCategoriesInterface {
  brandId?: number
  sellerId?: number
  onCategoryFilterChanged: (
    _: { value: InputMaybe<number> } & {
      status: Checkbox.CheckedState
    }
  ) => void
  categoryIdsFilter: InputMaybe<number[]> | undefined
}
type BrandOrSellerCategoriesProps = RequireAtLeastOne<
  BrandOrSellerCategoriesInterface,
  "brandId" | "sellerId"
>

const BrandOrSellerCategories = ({
  brandId,
  sellerId,
  onCategoryFilterChanged,
  categoryIdsFilter
}: BrandOrSellerCategoriesProps) => {
  const args: IndexCategoryInput = {}
  if (brandId) args["brandId"] = brandId
  if (sellerId) args["sellerId"] = sellerId
  const { data } = useQuery<GetAllCategoriesQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.ALL_CATEGORIES_QUERY_KEY, args],
    queryFn: () => getAllCategoriesQueryFn(args)
  })

  const categories = data ? data.categories : undefined

  return (
    <div className="flex flex-col gap-3">
      {categories?.data.length &&
        categories.data.map(
          (category) =>
            category && (
              <Label.Root key={category.id} className="flex items-center gap-2">
                <Checkbox.Root
                  className="flex
                    h-5
                    w-5
                    appearance-none
                    items-center
                    justify-center
                    rounded-md
                    border-2
                    border-alpha-600
                    bg-white
                    outline-none
                    data-[state='checked']:border-primary-500
                    data-[state='checked']:bg-primary-500"
                  checked={
                    !!categoryIdsFilter &&
                    categoryIdsFilter.some((item) => item === category.id)
                  }
                  onCheckedChange={(checked) =>
                    onCategoryFilterChanged({
                      status: checked,
                      value: category.id
                    })
                  }
                >
                  <Checkbox.Indicator className="text-white">
                    <LucideCheck className="h-3 w-3" strokeWidth={3} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className="inline-block leading-none">
                  {category.title}
                </span>
              </Label.Root>
            )
        )}
    </div>
  )
}

type MobileCategoriesFilterProps = {
  categoryId?: InputMaybe<number[]> | undefined
  brandId?: number
  sellerId?: number
  categoryIdsFilter: InputMaybe<number[]> | undefined
  onCategoryFilterChanged: (
    _: { value: InputMaybe<number> } & { status: Checkbox.CheckedState }
  ) => void
}

const MobileCategoriesFilter = ({
  categoryId,
  brandId,
  sellerId,
  onCategoryFilterChanged,
  categoryIdsFilter
}: MobileCategoriesFilterProps) => {
  const { push } = useRouter()
  const { categoriesFilterVisibilityAtom } = useContext(PublicContext)
  const [CategoriesFilterVisibility, setCategoriesFilterVisibility] = useAtom(
    categoriesFilterVisibilityAtom
  )
  const [previousCategory, setPreviousCategory] = useState<Category | null>(
    null
  )
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )
  // const [selectedCategoriesFilter, setSelectedCategoriesFilter] =
  //   useState<Category | null>(null)

  useEffect(() => {
    if (!CategoriesFilterVisibility) {
      if (categoryId && categoryId.length === 1 && categoryId[0] !== 0)
        setSelectedCategory({
          id: categoryId[0]
        } as Category)
      setPreviousCategory(null)
    }
  }, [CategoriesFilterVisibility, categoryId])

  return (
    <Dialog
      modal={false}
      open={CategoriesFilterVisibility}
      onOpenChange={setCategoriesFilterVisibility}
    >
      <DialogContent className="max-w-screen h-screen max-h-screen w-screen rounded-none">
        <div>
          <div className="sticky top-0 border-b border-alpha-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (!brandId && !sellerId) {
                    if (!selectedCategory) setCategoriesFilterVisibility(false)
                    if (selectedCategory && !previousCategory) {
                      setSelectedCategory(null)
                    }
                    if (selectedCategory && previousCategory) {
                      setSelectedCategory(previousCategory)
                      setPreviousCategory(
                        selectedCategory.parentCategory || null
                      )
                    }
                  } else {
                    setCategoriesFilterVisibility(false)
                  }
                }}
                variant="ghost"
                size="small"
                iconOnly
              >
                <LucideArrowRight className="h-5 w-5" />
              </Button>
              <div className="font-bold text-alpha-800">
                {selectedCategory && !brandId && !sellerId
                  ? selectedCategory.title
                  : "همه دسته‌بندی‌ها"}
              </div>
            </div>
          </div>
          <div className="p-4">
            {brandId && (
              <BrandOrSellerCategories
                brandId={brandId}
                categoryIdsFilter={categoryIdsFilter}
                onCategoryFilterChanged={onCategoryFilterChanged}
              />
            )}
            {sellerId && (
              <BrandOrSellerCategories
                sellerId={sellerId}
                categoryIdsFilter={categoryIdsFilter}
                onCategoryFilterChanged={onCategoryFilterChanged}
              />
            )}
            {!brandId &&
              !sellerId &&
              selectedCategory &&
              selectedCategory.id !== 0 && (
                <CategoriesList
                  onMounted={(category) => {
                    setSelectedCategory(category)
                    setPreviousCategory(category.parentCategory || null)
                  }}
                  onCategoryChanged={(category, force) => {
                    category.childrenCount > 0 && !force
                      ? (setPreviousCategory(selectedCategory),
                        setSelectedCategory(category))
                      : (setCategoriesFilterVisibility(false),
                        push(`/products/${category.id}/${category.title}`))
                  }}
                  categoryId={selectedCategory.id}
                />
              )}
            {!brandId &&
              !sellerId &&
              !selectedCategory &&
              !sellerId &&
              !brandId && (
                <VocabulariesList
                  onCategoryChanged={(category) => {
                    category.childrenCount > 0
                      ? setSelectedCategory(category)
                      : (setCategoriesFilterVisibility(false),
                        push(`/products/${category.id}/${category.title}`))
                  }}
                />
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MobileCategoriesFilter
