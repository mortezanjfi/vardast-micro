"use client"

import { useMemo } from "react"
import {
  _authentication_profile_sidebarMenu,
  _authentication_signin_sidebarMenu,
  _authentication_signout_sidebarMenu
} from "@vardast/lib/constants"
import { NavigationType } from "@vardast/type/Navigation"
import { useSession } from "next-auth/react"

import { MotionSection } from "./motion/Motion"
import NavigationItem from "./NavigationItem"
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
          return _authentication_signout_sidebarMenu
        }
        if (status === "unauthenticated") {
          return _authentication_signin_sidebarMenu
        }
      }
    }
    return null
  }, [props.withLogin, session, status])

  const profileMenu = useMemo(() => {
    if (props.withProfile) {
      return _authentication_profile_sidebarMenu
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
            <MotionSection
              variants={{
                hidden: { opacity: 0, y: 0, x: 0, scale: 0 },
                enter: { opacity: 1, y: 0, x: 0, scale: 1 },
                exit: { opacity: 0, y: 0, x: 0, scale: 0 } // Add exit variant for completeness
              }}
              initial="hidden" // Set the initial state to variants.hidden
              animate="enter" // Animated state to variants.enter
              exit="exit" // Exit state (used later) to variants.exit
              transition={{ type: "linear", delay: 0.2 }} // Set the transition to linear with a delay of 0.5 seconds
              className="app-navigation-section"
              key={sectionId}
            >
              <ol className="app-navigation-section-list">
                {menuSection.title && (
                  <li className="app-navigation-section-label !text-alpha-500">
                    {menuSection.title}
                  </li>
                )}
                {profileMenu && (
                  <NavigationItem session={session} menu={profileMenu} />
                )}
                {menuSection.items &&
                  menuSection.items.map(
                    (menuItem, idx) =>
                      ((menuItem?.abilities &&
                        session?.abilities?.includes(menuItem?.abilities)) ||
                        !menuItem.abilities) && (
                        <NavigationItem
                          key={idx}
                          session={session}
                          menu={menuItem}
                        />
                      )
                  )}
              </ol>
            </MotionSection>
          )
        )
      })}

      {loginToggleMenu && (
        <MotionSection
          variants={{
            hidden: { opacity: 0, y: 0, x: 0, scale: 0 },
            enter: { opacity: 1, y: 0, x: 0, scale: 1 },
            exit: { opacity: 0, y: 0, x: 0, scale: 0 } // Add exit variant for completeness
          }}
          initial="hidden" // Set the initial state to variants.hidden
          animate="enter" // Animated state to variants.enter
          exit="exit" // Exit state (used later) to variants.exit
          transition={{ type: "linear", delay: 0.3 }} // Set the transition to linear with a delay of 0.5 seconds
          className="app-navigation-section"
        >
          <ol className="app-navigation-section-list">
            <NavigationItem session={session} menu={loginToggleMenu} />
          </ol>
        </MotionSection>
      )}
    </>
  )
}

export default Navigation
