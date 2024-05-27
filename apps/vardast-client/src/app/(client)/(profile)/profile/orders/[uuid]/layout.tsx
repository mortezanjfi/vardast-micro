import { PropsWithChildren } from "react"
import { headers } from "next/headers"
import {
  CheckCircleIcon,
  CubeIcon,
  CurrencyDollarIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline"
import Stepper from "@vardast/component/Stepper"

const steppers = [
  {
    name: "اطلاعات سفارش",
    Icon: InformationCircleIcon,
    currentStep: 0
  },
  {
    name: "کالاهای سفارش",
    Icon: CubeIcon,
    currentStep: 1
  },
  { name: "تایید کالاهای سفارش", Icon: CheckCircleIcon, currentStep: 2 },
  { name: "قیمت گذاری", Icon: CurrencyDollarIcon, currentStep: 3 }
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

const Layout: React.FC<PropsWithChildren> = async ({ children, ...props }) => {
  const headersList = headers()
  const urlPathname = headersList.get("x-url-pathname") || "URL not found"
  const matchedUrlStepIndex =
    urlToStepMapper.find((item) => urlPathname.includes(item.name))
      ?.stepNumber ?? 2

  return (
    <div className="flex flex-col gap">
      <Stepper steps={steppers} step={matchedUrlStepIndex} />
      <div>{children}</div>
    </div>
  )
}
export default Layout
