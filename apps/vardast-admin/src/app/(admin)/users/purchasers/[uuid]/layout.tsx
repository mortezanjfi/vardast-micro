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

  const urlToStepMappers: urlToStepMapper[] = [
    {
      stepNumber: 0,
      name: "address"
    },
    {
      stepNumber: 1,
      name: "legal"
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
