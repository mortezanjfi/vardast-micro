"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

const toggleVariants = cva(
  "focus-visible:ring-ring data-[state=on]:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-alpha-300 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-alpha-white",
  {
    variants: {
      variant: {
        default: "bg-alpha-100",
        outline:
          "border-input border bg-transparent shadow-sm hover:bg-alpha-100 hover:text-primary"
      },
      size: {
        default: "px-3",
        sm: "px-2",
        lg: "h-full basis-1/2 py-2"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.RootX
    ref={ref}
    className={mergeClasses({ variant, size, className })}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
