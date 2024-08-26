import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactElement
} from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { LucideX } from "lucide-react"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitives.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    className={mergeClasses(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse sm:bottom-0 sm:left-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    ref={ref}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 space-x-reverse overflow-hidden rounded-md border p-6 pr-8 transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "card",
        success: "bg-success text-white",
        danger: "bg-error text-white",
        warning: "bg-warning text-success",
        info: "bg-info text-white",
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const Toast = forwardRef<
  ElementRef<typeof ToastPrimitives.Root>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      className={mergeClasses(toastVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitives.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    className={mergeClasses(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-black/50 bg-transparent px-3 text-sm font-medium ring-offset-black/20 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitives.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    className={mergeClasses(
      "absolute left-2 top-2 rounded-md p-1 text-white/50 opacity-0 transition-opacity hover:text-white focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className
    )}
    ref={ref}
    toast-close=""
    {...props}
  >
    <LucideX className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitives.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    className={mergeClasses("text-sm font-semibold", className)}
    ref={ref}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitives.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    className={mergeClasses("text-sm opacity-90", className)}
    ref={ref}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = ReactElement<typeof ToastAction>

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps
}
