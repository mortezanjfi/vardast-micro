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

import DynamicHeroIcon from "./DynamicHeroIcon"
import Link from "./Link"

type Props = {
  menu: NavigationItemType
  session: Session | null
}

const NavigationItem = (props: Props) => {
  const pathname = usePathname()
  const [open, setOpen] = useState<boolean>(false)
  const { width } = useWindowSize()

  const isMobileView = width < breakpoints.md

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
          menu?.items && "has-child",
          isActive(menu.path) && "active",
          open && "open"
        ])}
      >
        <span>
          <Link className="app-navigation-item-link" href={menu.path}>
            {menu?.icon && (
              <DynamicHeroIcon
                className={clsx("icon", menu.background_color, menu.color)}
                icon={menu?.icon}
                solid={isActive(menu.path)}
              />
            )}
            <span>
              {menu.title}
              {isMobileView ? (
                <div className="app-navigation-item-arrow">
                  <LucideChevronLeft className="h-full w-full" />
                </div>
              ) : menu?.items ? (
                <Button
                  className="app-navigation-item-arrow"
                  noStyle
                  onClick={() => {
                    if (!isActive(menu.path)) {
                      toggleOpen()
                    }
                  }}
                >
                  <LucideChevronDown className="h-full w-full" />
                </Button>
              ) : null}
            </span>
          </Link>
        </span>
        {menu?.items && (
          <ol className="app-navigation-item-children">
            {menu?.items.map((menuChildren, idx) => {
              if (menuChildren?.items?.length) {
                return (
                  <ol className="app-navigation-item-children-item">
                    {menuChildren?.title && (
                      <div className="app-navigation-item">
                        <li className="app-navigation-item-children-item-link">
                          <span>{menuChildren.title}</span>
                        </li>
                      </div>
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
                              key={idx}
                              menu={menuItem}
                              session={props?.session}
                            />
                          )
                      )}
                    </div>
                  </ol>
                )
              }
              return (
                <li className="app-navigation-item-children-item" key={idx}>
                  <Link
                    className={clsx([
                      "app-navigation-item-children-item-link",
                      isActive(menuChildren.path) && "active"
                    ])}
                    href={menuChildren.path}
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
