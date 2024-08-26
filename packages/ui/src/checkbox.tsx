"use client"

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Check } from "lucide-react"

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    className={mergeClasses("checkbox-indicator", className)}
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={mergeClasses("checkbox-indicator-inner")}
    >
      <Check className="h-full w-full" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

// "use client"

// import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
// import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
// import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"

// const Checkbox = forwardRef<
//   ElementRef<typeof CheckboxPrimitive.Root>,
//   ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
// >(({ className, ...props }, ref) => (
//   <CheckboxPrimitive.Root
//     ref={ref}
//     className={mergeClasses(
//       "focus-visible:ring-ring data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
//       className
//     )}
//     {...props}
//   >
//     <CheckboxPrimitive.Indicator
//       className={mergeClasses("flex items-center justify-center text-current")}
//     >
//       <svg viewBox="0 0 18 18">
//         <polyline points="1 9 7 14 15 4" />
//       </svg>
//     </CheckboxPrimitive.Indicator>
//   </CheckboxPrimitive.Root>
// ))
// Checkbox.displayName = CheckboxPrimitive.Root.displayName

// export { Checkbox }
