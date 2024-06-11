"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import dynamicIconImports from "lucide-react/dynamicIconImports"

import Stepper from "./Stepper"

export interface Step {
  name: string
  Icon: keyof typeof dynamicIconImports
  currentStep: number
  description?: string
}
export interface urlToStepMapper {
  stepNumber: number
  name: string
}

type offerItemStepper = {
  steppers: Step[]
  urlToStepMapper: urlToStepMapper[]
}

const OfferItemStepper = ({ steppers, urlToStepMapper }: offerItemStepper) => {
  const pathname = usePathname()
  const matchedUrlStepIndex =
    urlToStepMapper.find((item) => pathname.includes(item.name))?.stepNumber ??
    2

  useEffect(() => {}, [pathname])

  return <Stepper steps={steppers} step={matchedUrlStepIndex} />
}
export default OfferItemStepper
