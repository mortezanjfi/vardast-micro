import * as React from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

const alertVariants = cva(
  "relative w-full rounded-md border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:right-4 [&>svg]:top-4 [&>svg]:text-alpha-400 [&>svg~*]:pr-9",
  {
    variants: {
      variant: {
        default: "bg-white text-alpha-700",
        danger:
          "border-red-500/20 bg-red-500/5 text-red-600 [&>svg]:text-red-500",
        warning:
          "border-amber-500/20 bg-amber-500/5 text-amber-700 [&>svg]:text-amber-500",
        info: "border-blue-500/20 bg-blue-500/5 text-blue-600 [&>svg]:text-blue-500",
        success:
          "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 [&>svg]:text-emerald-500"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    className={mergeClasses(alertVariants({ variant }), className)}
    ref={ref}
    role="alert"
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    className={mergeClasses(
      "mb-1 font-medium leading-none tracking-tight",
      className
    )}
    ref={ref}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    className={mergeClasses("text-sm [&_p]:leading-relaxed", className)}
    ref={ref}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription, AlertTitle }
