import { forwardRef, InputHTMLAttributes } from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"

export type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={mergeClasses("input-field", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
