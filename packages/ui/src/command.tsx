"use client"

import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  HTMLAttributes
} from "react"
import { DialogProps } from "@radix-ui/react-dialog"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Command as CommandPrimitive } from "cmdk"
import { Loader2, LucideSearch } from "lucide-react"

import { Dialog, DialogContent } from "./dialog"

const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <div className="combobox-list-container">
    <CommandPrimitive
      className={mergeClasses("combobox-popover", className)}
      ref={ref}
      {...props}
    />
  </div>
))
Command.displayName = CommandPrimitive.displayName

type CommandDialogProps = DialogProps

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="combobox-dialog">
        <Command className="combobox-command">{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    loading?: boolean
  }
>(({ className, loading, ...props }, ref) => (
  <div className="combobox-search" cmdk-input-wrapper="">
    {loading ? (
      <Loader2 className="combobox-search-icon" />
    ) : (
      <LucideSearch className="combobox-search-icon" />
    )}
    <CommandPrimitive.Input
      className={mergeClasses("combobox-search-input", className)}
      ref={ref}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    className={mergeClasses("combobox-list", className)}
    ref={ref}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty className="combobox-empty" ref={ref} {...props} />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    className={mergeClasses("combobox-group", className)}
    ref={ref}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    className={mergeClasses("combobox-separator", className)}
    ref={ref}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    className={mergeClasses("combobox-list-item", className)}
    ref={ref}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={mergeClasses("combobox-shortcut", className)} {...props} />
  )
}
CommandShortcut.displayName = "CommandShortcut"

const CommandLoading = CommandPrimitive.Loading

CommandLoading.displayName = "CommandLoading"

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
  CommandShortcut
}
