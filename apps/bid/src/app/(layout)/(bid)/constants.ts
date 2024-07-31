import {
  OrderOfferStatuses,
  PaymentMethodEnum,
  PreOrderStates
} from "@vardast/graphql/generated"
import { BadgeVariantsType } from "@vardast/ui/badge"

export const OrderOfferStatusesFa = {
  [OrderOfferStatuses.Closed]: { className: "tag-success", name_fa: "بسته شده" }
}

export const PreOrderStatesFa: Record<
  PreOrderStates,
  { variant: BadgeVariantsType; name_fa_admin: string; name_fa: string }
> = {
  [PreOrderStates.PendingAdmin]: {
    variant: "info",
    name_fa_admin: "در انتظار تایید ادمین",
    name_fa: "جاری"
  },
  [PreOrderStates.PendingInfo]: {
    variant: "info",
    name_fa_admin: "در انتظار دریافت اطلاعات",
    name_fa: "جاری"
  },
  [PreOrderStates.PendingOffer]: {
    variant: "info",
    name_fa_admin: "در انتظار پیشنهاد قیمت",
    name_fa: "جاری"
  },
  [PreOrderStates.PendingProduct]: {
    variant: "info",
    name_fa_admin: "در انتظار افزودن کالا",
    name_fa: "جاری"
  },
  [PreOrderStates.VerifyFile]: {
    variant: "info",
    name_fa_admin: "در انتظار تایید فایل",
    name_fa: "جاری"
  },
  [PreOrderStates.Closed]: {
    variant: "success",
    name_fa_admin: "خریداری شده",
    name_fa: "خریداری شده"
  },
  [PreOrderStates.Completed]: {
    variant: "default",
    name_fa_admin: "خریداری نشده",
    name_fa: "خریداری نشده"
  },
  [PreOrderStates.PendingPayment]: {
    variant: "warning",
    name_fa: "در انتظار پرداخت",
    name_fa_admin: "در انتظار پرداخت"
  },
  [PreOrderStates.Rejected]: {
    variant: "danger",
    name_fa: "رد شده",
    name_fa_admin: "رد شده"
  }
}

export const PaymentMethodEnumFa = {
  [PaymentMethodEnum.Cash]: {
    className: "",
    name_fa: "نقدی"
  },
  [PaymentMethodEnum.Credit]: {
    className: "",
    name_fa: "غیر نقدی"
  }
}
