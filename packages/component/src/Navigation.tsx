"use client"

import { NavigationType } from "@vardast/type/Navigation"
import { useSession } from "next-auth/react"

import NavigationItem from "./NavigationItem"

type Props = {
  menus: NavigationType[]
}

const Navigation = (props: Props) => {
  const { data: session } = useSession()
  const { menus } = props

  return (
    <>
      {menus.map((menuSection, sectionId) => {
        return (
          ((menuSection.role &&
            session?.profile?.roles.some(
              (role) => role?.name === menuSection.role
            )) ||
            !menuSection.role) && (
            <section className="app-navigation-section" key={sectionId}>
              <ol className="app-navigation-section-list">
                {menuSection.title && (
                  <li className="app-navigation-section-label">
                    {menuSection.title}
                  </li>
                )}
                {menuSection.items &&
                  menuSection.items.map(
                    (menuItem, idx) =>
                      ((menuItem?.abilities &&
                        session?.abilities?.includes(menuItem?.abilities)) ||
                        !menuItem.abilities) && (
                        <NavigationItem key={idx} menu={menuItem} />
                      )
                  )}
              </ol>
            </section>
          )
        )
      })}
    </>
  )
}

export default Navigation
