"use client"

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

const labelVariants = cva("form-label")

interface LabelProps extends VariantProps<typeof labelVariants> {
  noStyle?: boolean
}

const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & LabelProps
>(({ noStyle = false, className, ...props }, ref) => (
  <LabelPrimitive.Root
    className={
      noStyle
        ? mergeClasses(className)
        : mergeClasses(labelVariants(), className)
    }
    ref={ref}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
