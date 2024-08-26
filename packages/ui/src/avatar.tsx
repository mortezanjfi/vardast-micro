"use client"

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

const avatarVariants = cva("avatar", {
  variants: {
    size: {
      xsmall: "avatar-xs",
      small: "avatar-sm",
      DEFAULT: "",
      medium: "avatar-md",
      large: "avatar-lg",
      xlarge: "avatar-xl"
    },
    rounded: {
      true: "rounded-full"
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

export interface AvatarProps
  extends AvatarPrimitive.AvatarProps,
    VariantProps<typeof avatarVariants> {}

const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ size, rounded, className, ...props }: AvatarProps, ref) => (
  <AvatarPrimitive.Root
    className={mergeClasses(
      avatarVariants({
        size,
        rounded,
        className
      })
    )}
    ref={ref}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    className={mergeClasses("aspect-square h-full w-full", className)}
    ref={ref}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Fallback>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    className={mergeClasses(
      "bg-muted flex h-full w-full items-center justify-center rounded-full",
      className
    )}
    ref={ref}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarFallback, AvatarImage }
