"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { NavigationItemType } from "@vardast/type/Navigation"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideChevronDown } from "lucide-react"

import DynamicIcon from "./DynamicIcon"
import Link from "./Link"

type Props = {
  menu: NavigationItemType
}

const NavigationItem = (props: Props) => {
  const pathname = usePathname()
  const [open, setOpen] = useState<boolean>(false)
  const { menu } = props

  const toggleOpen = () => {
    const oldOpen = open
    setOpen(!oldOpen)
  }

  const isActive = (linkPath: string): boolean => {
    const currentPathModified = pathname.split("/").slice(1).join("/")
    const linkPathModified = linkPath?.split("/").slice(1).join("/")

    return linkPathModified === currentPathModified
      ? true
      : linkPathModified !== "" &&
          currentPathModified.startsWith(linkPathModified)
  }

  return (
    <>
      <li
        className={clsx([
          "app-navigation-item",
          menu.items && "has-child",
          isActive(menu.path as string) && "active",
          open && "open"
        ])}
      >
        <span>
          <Link href={menu.path as string} className="app-navigation-item-link">
            <DynamicIcon name={menu.icon} className="icon" strokeWidth={1.5} />
            <span className={clsx("flex-1", menu.color)}>{menu.title}</span>
          </Link>
          {menu.items && (
            <Button
              className="app-navigation-item-arrow"
              noStyle
              onClick={() => !isActive(menu.path as string) && toggleOpen()}
            >
              <LucideChevronDown className="h-4 w-4" />
            </Button>
          )}
        </span>
        {menu.items && (
          <ol className="app-navigation-item-children">
            {menu.items.map((menuChildren, idx) => {
              return (
                <li key={idx} className="app-navigation-item-children-item">
                  <Link
                    href={menuChildren.path as string}
                    className={clsx([
                      "app-navigation-item-children-item-link",
                      isActive(menuChildren.path as string) && "active"
                    ])}
                  >
                    <span>{menuChildren.title}</span>
                  </Link>
                </li>
              )
            })}
          </ol>
        )}
      </li>
    </>
  )
}

export default NavigationItem
