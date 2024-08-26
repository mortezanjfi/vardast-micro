"use client"

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { PortalProps } from "@radix-ui/react-portal"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    container?: PortalProps["container"]
  }
>(
  (
    { className, container, align = "center", sideOffset = 6, ...props },
    ref
  ) => (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        align={align}
        className={mergeClasses(className)}
        ref={ref}
        sideOffset={sideOffset}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverContent, PopoverTrigger }
