import { ProductSortablesEnum } from "@vardast/graphql/generated"

export const productsSort = [
  {
    status: "جدیدترین",
    value: ProductSortablesEnum.Newest
  },
  { status: "قدیمی‌ترین", value: ProductSortablesEnum.Oldest },
  {
    status: "گرانترین",
    value: ProductSortablesEnum.MostExpensive
  },
  {
    status: "ارزانترین",
    value: ProductSortablesEnum.MostAffordable
  },
  {
    status: "بیشترین فروشنده",
    value: ProductSortablesEnum.MostOffer
  },
  {
    status: "نام",
    value: ProductSortablesEnum.Name
  }
]
