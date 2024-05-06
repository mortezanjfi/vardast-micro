"use client"

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={mergeClasses("checkbox-indicator", className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={mergeClasses("checkbox-indicator-inner")}
    >
      <svg viewBox="0 0 18 18">
        <polyline points="1 9 7 14 15 4" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
