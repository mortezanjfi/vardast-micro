import { SortBrandEnum } from "../../graphql/src/generated"

export const brandSorts = [
  {
    status: "جدیدترین",
    value: SortBrandEnum.Newest
  },
  { status: "بالاترین امتیاز", value: SortBrandEnum.Rating },
  {
    status: "بیشترین کالا",
    value: SortBrandEnum.Sum
  },
  {
    status: "پربازدیدترین",
    value: SortBrandEnum.View
  }
]
