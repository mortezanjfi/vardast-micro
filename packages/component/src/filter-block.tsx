"use client"

import { ReactNode, useState } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideChevronDown } from "lucide-react"

import { THeroIconName } from "../../type/src/layout"
import DynamicHeroIcon from "./DynamicHeroIcon"

type FilterBlockProps = {
  title: string
  children: ReactNode
  openDefault?: boolean
  icon?: THeroIconName
}

const FilterBlock = ({
  icon,
  title,
  children,
  openDefault = false
}: FilterBlockProps) => {
  const [open, setOpen] = useState(openDefault)

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 py-3">
        {icon && <DynamicHeroIcon icon={icon} className="h-7 w-7" solid />}{" "}
        <span className=" font-medium text-alpha-800">{title}</span>
        <Collapsible.Trigger asChild>
          <Button variant="ghost" size="small" className="mr-auto" iconOnly>
            <LucideChevronDown
              className={clsx(["icon", open ? "rotate-180" : ""])}
            />
          </Button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <div className="overflow-hidden pb-3 text-justify">{children}</div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export default FilterBlock
