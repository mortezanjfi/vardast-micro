import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useContext,
  useId
} from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { cva, VariantProps } from "class-variance-authority"
import clsx from "clsx"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext
} from "react-hook-form"

import { Label } from "./label"

const formControlVariants = cva("form-control", {
  variants: {
    size: {
      xsmall: "form-control-xs",
      small: "form-control-sm",
      DEFAULT: "",
      medium: "form-control-md",
      large: "form-control-lg",
      xlarge: "form-control-xl"
    },
    rounded: {
      true: "form-control-rounded"
    },
    plaintext: {
      true: "form-control-plaintext"
    }
  },
  compoundVariants: [
    {
      size: "DEFAULT"
    }
  ],
  defaultVariants: {
    size: "DEFAULT"
  }
})

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          className={mergeClasses("form-field", className)}
          {...props}
        />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

interface LabelProps {
  noStyle?: boolean
}

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & LabelProps
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={mergeClasses(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

export interface FormControlProps
  extends VariantProps<typeof formControlVariants> {
  toggleInputGroup?: string
  toggleInsetInputGroup?: string
  prefixAddon?: ReactNode
  suffixAddon?: ReactNode
  prefixElement?: ReactNode
  suffixElement?: ReactNode
}

const FormControl = forwardRef<
  ElementRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot> & FormControlProps
>(
  (
    {
      toggleInsetInputGroup,
      toggleInputGroup,
      prefixAddon,
      prefixElement,
      suffixElement,
      suffixAddon,
      size,
      rounded,
      plaintext,
      className,
      dir,
      ...props
    },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField()

    return (
      <div
        className={mergeClasses(
          formControlVariants({ size, rounded, plaintext }),
          className
        )}
        dir={dir}
      >
        <div className={clsx("input-group", toggleInputGroup)}>
          {prefixAddon && <div className="input-addon">{prefixAddon}</div>}
          <div className={clsx("input-inset", toggleInsetInputGroup)}>
            {prefixElement && (
              <div className="input-element">{prefixElement}</div>
            )}
            <Slot
              ref={ref}
              id={formItemId}
              aria-describedby={
                !error
                  ? `${formDescriptionId}`
                  : `${formDescriptionId} ${formMessageId}`
              }
              aria-invalid={!!error}
              {...props}
            />
            {suffixElement && (
              <div className="input-element">{suffixElement}</div>
            )}
          </div>
          {suffixAddon && <div className="input-addon">{suffixAddon}</div>}
        </div>
      </div>
    )
  }
)
FormControl.displayName = "FormControl"

const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={mergeClasses("form-message", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={mergeClasses("form-message error", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
}
