import { ReactNode } from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { cva, VariantProps } from "class-variance-authority"
import clsx from "clsx"

const cardVariants = cva("card rounded p-4", {
  variants: {
    template: {
      "1/2": ["grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]"]
    }
  }
})

interface CardProps extends VariantProps<typeof cardVariants> {
  titleClass?: string
  className?: string
  title?: string
  description?: string
  children: ReactNode
}

const Card = ({
  titleClass,
  title,
  description,
  template,
  className,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={mergeClasses(cardVariants({ template, className }))}
      {...props}
    >
      <div className="flex">
        {title && (
          <h2 className={clsx("font-medium text-alpha-800", titleClass)}>
            {title}
          </h2>
        )}
        {description && <p className="text-sm text-alpha-500">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

export default Card
