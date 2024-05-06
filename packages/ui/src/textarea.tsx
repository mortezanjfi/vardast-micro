import { forwardRef, TextareaHTMLAttributes } from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={mergeClasses("input-field", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
