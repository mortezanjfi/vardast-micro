"use client"

import { ReactNode, useState } from "react"
import * as Collapsible from "@radix-ui/react-collapsible"
import { THeroIconName } from "@vardast/type/layout"
import { Badge } from "@vardast/ui/badge"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideChevronDown } from "lucide-react"

import DynamicHeroIcon from "./DynamicHeroIcon"

type FilterBlockProps = {
  title: string
  children: ReactNode
  openDefault?: boolean
  icon?: THeroIconName
  badgeNumber?: number
}

const FilterBlock = ({
  icon,
  title,
  children,
  openDefault = false,
  badgeNumber
}: FilterBlockProps) => {
  const [open, setOpen] = useState(openDefault)

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 py-3">
        {icon && <DynamicHeroIcon className="h-7 w-7" icon={icon} solid />}{" "}
        <span className=" font-medium text-alpha-800">{title}</span>
        {badgeNumber && (
          <Badge size="xs" variant="danger">
            {badgeNumber}
          </Badge>
        )}
        <Collapsible.Trigger asChild>
          <Button className="mr-auto" iconOnly size="small" variant="ghost">
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
