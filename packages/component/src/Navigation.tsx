"use client"

import { useMemo } from "react"
import {
  _authentication_profile_sidebarMenu,
  _authentication_signin_sidebarMenu,
  _authentication_signout_sidebarMenu
} from "@vardast/lib/constants"
import { NavigationType } from "@vardast/type/Navigation"
import { useSession } from "next-auth/react"

import NavigationItem, { NavigationItemVariant } from "./NavigationItem"
import { SidebarProfile } from "./Sidebar"

type Props = {
  menus: NavigationType[]
  withLogin?: boolean
  withProfile?: boolean
}

const Navigation = (props: Props) => {
  const { data: session, status } = useSession()
  const { menus } = props

  const loginToggleMenu = useMemo(() => {
    if (props.withLogin) {
      if (status !== "loading") {
        if (status === "authenticated") {
          return { variant: "error", menu: _authentication_signout_sidebarMenu }
        }
        if (status === "unauthenticated") {
          return {
            variant: "success",
            menu: _authentication_signin_sidebarMenu
          }
        }
      }
    }
    return null
  }, [props.withLogin, session, status])

  const profileMenu = useMemo(() => {
    if (props.withProfile) {
      return { variant: "primary", menu: _authentication_profile_sidebarMenu }
    }
    return null
  }, [props.withProfile])

  return (
    <>
      {profileMenu && <SidebarProfile session={session} />}

      {menus?.map((menuSection, sectionId) => {
        return (
          ((menuSection.role &&
            session?.profile?.roles.some(
              (role) => role?.name === menuSection.role
            )) ||
            !menuSection.role) && (
            <section className="app-navigation-section" key={sectionId}>
              <ol className="app-navigation-section-list">
                {menuSection.title && (
                  <li className="app-navigation-section-label !text-alpha-500">
                    {menuSection.title}
                  </li>
                )}
                {profileMenu && (
                  <NavigationItem
                    variant={profileMenu.variant as NavigationItemVariant}
                    menu={profileMenu.menu}
                  />
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
                {loginToggleMenu && (
                  <NavigationItem
                    variant={loginToggleMenu.variant as NavigationItemVariant}
                    menu={loginToggleMenu.menu}
                  />
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
