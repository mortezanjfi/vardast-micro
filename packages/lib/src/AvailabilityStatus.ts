import {
  ProductImageStatusEnum,
  ProductPriceStatusEnum
} from "@vardast/graphql/generated"

export enum AvailabilityStatus {
  Available = "true",
  NotAvailable = "false",
  All = ""
}

export interface StatusOption {
  status: string
  value: AvailabilityStatus
}

export const statusesOfAvailability: StatusOption[] = [
  {
    status: "دارد",
    value: AvailabilityStatus.Available
  },
  {
    status: "ندارد",
    value: AvailabilityStatus.NotAvailable
  }
]

export const productPriceOptions = [
  {
    status: "دارد",
    value: ProductPriceStatusEnum.HasPrice
  },
  {
    status: "ندارد",
    value: ProductPriceStatusEnum.NoPrice
  },
  {
    status: "لیست قیمت‌های کمتر از ۴ ماه",
    value: ProductPriceStatusEnum.PriceLessThan_4Months
  },
  {
    status: "لیست قیمت‌های کمتر از ۶ ماه",
    value: ProductPriceStatusEnum.PriceLessThan_6Months
  }
]

export const imageExistence = [
  { status: "دارد", value: ProductImageStatusEnum.HasImage },
  { status: "ندارد", value: ProductImageStatusEnum.NoImage }
]
