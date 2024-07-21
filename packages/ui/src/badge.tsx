import * as React from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "text-alpha-foreground border-transparent bg-alpha-100 shadow hover:bg-alpha-100/80",
        primary:
          "text-primary-foreground border-transparent bg-primary-100 shadow hover:bg-primary-100/80",
        secondary:
          "text-secondary-foreground border-transparent bg-secondary-100 hover:bg-secondary-100/80",
        warning:
          "text-warning-foreground border-transparent bg-warning-100 hover:bg-warning-100/80",
        success:
          "text-success-foreground border-transparent bg-success-100 hover:bg-success-100/80",
        danger:
          "text-error-foreground border-transparent bg-error-100 hover:bg-error-100/80",
        outline: "text-foreground"
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm"
    }
  }
)

type BadgeVariants = VariantProps<typeof badgeVariants>

export type BadgeVariantsType = BadgeVariants["variant"]

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariants {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={mergeClasses(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
