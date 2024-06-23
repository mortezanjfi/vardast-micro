import {
  Step,
  urlToStepMapper
} from "../../component/src/template/OfferItemStepper"

export const _orderSteppers: Step[] = [
  {
    description: "اطلاعات اولیه سفارش خود را وارد کنید.",
    name: "اطلاعات سفارش",
    Icon: "badge-info",
    currentStep: 0
  },
  {
    description:
      "کالاها و هزینه های جانبی درخواستی خود را از یک یا ترکیبی از روش های زیر انتخاب کنید.",
    name: "افزودن کالا و هزینه های جانبی",
    Icon: "box",
    currentStep: 1
  },
  {
    description: "کالاها و هزینه های جانبی درخواستی خود را تایید کنید.",
    name: "تایید کالاهای سفارش",
    Icon: "check-circle-2",
    currentStep: 2
  },
  {
    description: "در این قسمت بر روی کالاهای درخواستی خود قیمت گذاری کنید.",
    name: "پیشنهادات",
    Icon: "badge-dollar-sign",
    currentStep: 3
  },
  {
    name: "پرداخت",
    Icon: "badge-dollar-sign",
    currentStep: 4
  }
]

export const _orderUrlToStepMappers: urlToStepMapper[] = [
  {
    stepNumber: 0,
    name: "info"
  },
  {
    stepNumber: 1,
    name: "products"
  },
  {
    stepNumber: 3,
    name: "offers"
  },
  {
    stepNumber: 4,
    name: "payment"
  }
]
export const _legalSteppers: Step[] = [
  {
    name: "اطلاعات تماس",
    Icon: "info",
    currentStep: 0
  },
  {
    name: "اطلاعات حقوقی",
    Icon: "info",
    currentStep: 1
  },
  {
    name: "اطلاعات مالی",
    Icon: "info",
    currentStep: 2
  },
  {
    name: "همکاران",
    Icon: "info",
    currentStep: 3
  },
  {
    name: "تایید نهایی",
    Icon: "info",
    currentStep: 4
  }
]

export const _legalUrlToStepMappers: urlToStepMapper[] = [
  {
    stepNumber: 0,
    name: "address"
  },
  {
    stepNumber: 1,
    name: "info"
  },
  {
    stepNumber: 2,
    name: "finance"
  },
  {
    stepNumber: 3,
    name: "collabs"
  },
  {
    stepNumber: 4,
    name: "submition"
  }
]
