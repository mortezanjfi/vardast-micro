import { ReactNode } from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Button } from "@vardast/ui/button"
import { cva, VariantProps } from "class-variance-authority"
import clsx from "clsx"

const cardVariants = cva("card rounded p-4", {
  variants: {
    template: {
      "1/2": ["grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]"],
      "1/2-sm": ["grid grid-cols-1 gap-1 sm:grid-cols-2 2xl:grid-cols-3"]
    },
    shadow: {
      none: "",
      md: "card-shadow"
    }
  },
  defaultVariants: {
    shadow: "md"
  }
})

export interface cardButton {
  text?: string
  type?: "button" | "submit" | "reset"
  variant?:
    | "link"
    | "primary"
    | "outline-primary"
    | "outline-blue"
    | "full-secondary"
    | "secondary"
    | "danger"
    | "ghost"
  className?: string
  onClick?: Function
  loading?: boolean
  disabled?: boolean
}

export interface CardProps extends VariantProps<typeof cardVariants> {
  button?: cardButton
  actionButton?: cardButton
  titleClass?: string
  className?: string
  title?: string
  description?: string
  children: ReactNode
}

const Card = ({
  button,
  actionButton,
  titleClass,
  title,
  description,
  template,
  shadow,
  className,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={mergeClasses(cardVariants({ template, shadow, className }))}
      {...props}
    >
      {(title || button || description) && (
        <div className="col-span-full flex pb">
          <div className="flex w-full justify-between">
            {title && (
              <h2 className={clsx("font-medium text-alpha-800 ", titleClass)}>
                {title}
              </h2>
            )}
            {button && (
              <Button
                className={clsx("py-2", button.className)}
                disabled={button.disabled}
                loading={button.loading}
                type={button.type}
                variant={button.variant}
                onClick={(e) => {
                  button?.onClick?.(e)
                }}
              >
                {button.text}
              </Button>
            )}
          </div>
          {description && (
            <p className="text-sm text-alpha-500">{description}</p>
          )}
        </div>
      )}
      {children}
      {actionButton && (
        <div className="col-span-full flex justify-end">
          <Button
            className={clsx("py-2", actionButton.className)}
            disabled={actionButton.disabled}
            loading={actionButton.loading}
            type={actionButton.type}
            variant={actionButton.variant}
            onClick={(e) => {
              actionButton?.onClick?.(e)
            }}
          >
            {actionButton.text}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Card
