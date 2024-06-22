"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import useWindowSize from "@vardast/hook/use-window-size"
import { breakpoints } from "@vardast/tailwind-config/themes"
import { NavigationItemType } from "@vardast/type/Navigation"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideChevronDown, LucideChevronLeft } from "lucide-react"
import { Session } from "next-auth"

import DynamicIcon from "./DynamicIcon"
import Link from "./Link"

export type NavigationItemVariant = "success" | "error" | "primary"
type Props = {
  menu: NavigationItemType
  variant?: NavigationItemVariant
  session: Session | null
}

const NavigationItem = (props: Props) => {
  const pathname = usePathname()
  const [open, setOpen] = useState<boolean>(false)
  const { width } = useWindowSize()

  const isMobileView = width < breakpoints["md"]

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
        <span className={clsx(props.variant)}>
          <Link href={menu.path as string} className="app-navigation-item-link">
            <DynamicIcon
              name={menu?.icon}
              className={clsx("icon", props.variant)}
              strokeWidth={1.5}
            />
            <span>
              {menu.title}
              {isMobileView ? (
                <div className="app-navigation-item-arrow">
                  <LucideChevronLeft className="h-4 w-4" />
                </div>
              ) : menu.items ? (
                <Button
                  className="app-navigation-item-arrow"
                  noStyle
                  onClick={() => {
                    if (!isActive(menu.path as string)) {
                      toggleOpen()
                    }
                  }}
                >
                  <LucideChevronDown className="h-4 w-4" />
                </Button>
              ) : null}
            </span>
          </Link>
        </span>
        {menu.items && (
          <ol className="app-navigation-item-children">
            {menu.items.map((menuChildren, idx) => {
              if (menuChildren?.items?.length) {
                return (
                  <ol className="app-navigation-item-children-item">
                    {menuChildren?.title && (
                      <li className="app-navigation-item-children-item-link">
                        {menuChildren.title}
                      </li>
                    )}
                    <div className="app-navigation-item app-navigation-item-children">
                      {menuChildren?.items?.map(
                        (menuItem, idx) =>
                          ((menuItem?.abilities &&
                            props?.session?.abilities?.includes(
                              menuItem?.abilities
                            )) ||
                            !menuItem.abilities) && (
                            <NavigationItem
                              session={props?.session}
                              key={idx}
                              menu={menuItem}
                            />
                          )
                      )}
                    </div>
                  </ol>
                )
              }
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
