import {
  forwardRef,
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes
} from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"

const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        className={mergeClasses("w-full caption-bottom text-sm", className)}
        ref={ref}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    className={mergeClasses("[&_tr]:border-b", className)}
    ref={ref}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    className={mergeClasses("[&_tr:last-child]:border-0", className)}
    ref={ref}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    className={mergeClasses(
      "text-primary-foreground bg-primary font-medium",
      className
    )}
    ref={ref}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    className={mergeClasses(
      "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
      className
    )}
    ref={ref}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    className={mergeClasses(
      "text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
      className
    )}
    ref={ref}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    className={mergeClasses(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      className
    )}
    ref={ref}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    className={mergeClasses("text-muted-foreground mt-4 text-sm", className)}
    ref={ref}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
}
