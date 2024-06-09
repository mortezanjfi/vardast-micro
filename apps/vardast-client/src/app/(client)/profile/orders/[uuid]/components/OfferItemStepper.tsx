"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  CheckCircleIcon,
  CubeIcon,
  CurrencyDollarIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline"
import Stepper from "@vardast/component/Stepper"

const steppers = [
  {
    description: "اطلاعات اولیه سفارش خود را وارد کنید.",
    name: "اطلاعات سفارش",
    Icon: InformationCircleIcon,
    currentStep: 0
  },
  {
    description:
      "کالاها و هزینه های جانبی درخواستی خود را از یک یا ترکیبی از روش های زیر انتخاب کنید.",
    name: "افزودن کالا و هزینه های جانبی",
    Icon: CubeIcon,
    currentStep: 1
  },
  {
    description: "کالاها و هزینه های جانبی درخواستی خود را تایید کنید.",
    name: "تایید کالاهای سفارش",
    Icon: CheckCircleIcon,
    currentStep: 2
  },
  {
    description: "در این قسمت بر روی کالاهای درخواستی خود قیمت گذاری کنید.",
    name: "پیشنهادات",
    Icon: CurrencyDollarIcon,
    currentStep: 3
  }
]

const urlToStepMapper = [
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
  }
]

const OfferItemStepper = () => {
  const pathname = usePathname()
  const matchedUrlStepIndex =
    urlToStepMapper.find((item) => pathname.includes(item.name))?.stepNumber ??
    2

  useEffect(() => {}, [pathname])

  return <Stepper steps={steppers} step={matchedUrlStepIndex} />
}
export default OfferItemStepper
