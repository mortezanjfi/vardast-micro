"use client"

import { PropsWithChildren } from "react"

import OfferItemStepper, { Step, urlToStepMapper } from "./OfferItemStepper"

export interface LayoutProps extends PropsWithChildren {
  steppers: Step[]
  urlToStepMapper: urlToStepMapper[]
  isMobileView?: boolean
}
const Layout = ({
  isMobileView,
  steppers,
  urlToStepMapper,
  children
}: LayoutProps) => {
  return (
    <div className="flex h-full flex-col gap-8">
      {!isMobileView && (
        <OfferItemStepper
          steppers={steppers}
          urlToStepMapper={urlToStepMapper}
        />
      )}
      <div className="h-full">{children}</div>
    </div>
  )
}
export default Layout
