import React, { ReactElement, ReactNode } from "react"

interface IStepRendering {
  step?: number | string
  children: ReactNode
}
const StepRendering: React.FC<IStepRendering> = ({ step, children }) => {
  return Array.isArray(children)
    ? children
        .filter((child: ReactElement) => typeof child === "object")
        .map((child, i) => i === step && child)
    : children
}

export default StepRendering
