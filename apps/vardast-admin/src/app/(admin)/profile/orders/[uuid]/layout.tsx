import { PropsWithChildren } from "react"
import LayoutWithStepper from "@vardast/component/template/LayoutWithStepper"
import {
  Step,
  urlToStepMapper
} from "@vardast/component/template/OfferItemStepper"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

const Layout: React.FC<PropsWithChildren> = async ({ children }) => {
  const steppers: Step[] = [
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
    }
  ]

  const urlToStepMappers: urlToStepMapper[] = [
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

  const isMobileView = await CheckIsMobileView()

  return (
    <LayoutWithStepper
      isMobileView={isMobileView}
      children={children}
      steppers={steppers}
      urlToStepMapper={urlToStepMappers}
    />
  )
}
export default Layout
