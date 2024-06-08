"use client"

import { ReactNode, useState } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideChevronDown } from "lucide-react"

type FilterBlockProps = {
  title: string
  children: ReactNode
  openDefault?: boolean
}

const FilterBlock = ({
  title,
  children,
  openDefault = false
}: FilterBlockProps) => {
  const [open, setOpen] = useState(openDefault)

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex items-center py-3">
        <span className="font-bold text-alpha-800">{title}</span>
        <Collapsible.Trigger asChild>
          <Button variant="ghost" size="small" className="mr-auto" iconOnly>
            <LucideChevronDown
              className={clsx(["icon", open ? "rotate-180" : ""])}
            />
          </Button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <div className="hide-scrollbar max-h-full overflow-y-auto pb-3 text-justify">
          {children}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export default FilterBlock
