import { ReactNode } from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { cva, VariantProps } from "class-variance-authority"

const cardVariants = cva("card rounded p-4", {
  variants: {
    template: {
      "1/2": ["grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]"]
    }
  }
})

interface CardProps extends VariantProps<typeof cardVariants> {
  className?: string
  title?: string
  description?: string
  children: ReactNode
}

const Card = ({
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
      <div>
        {title && <h2 className="font-medium text-alpha-800">{title}</h2>}
        {description && <p className="text-sm text-alpha-500">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

export default Card
