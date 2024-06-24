/* eslint-disable no-unused-vars */
"use client"

import Navigation from "@vardast/component/Navigation"
import { SidebarProfile } from "@vardast/component/Sidebar"
import sidebar_options from "@vardast/lib/sidebar_options"
import { useSession } from "next-auth/react"

const ProfilePageIndex = () => {
  const { data: session } = useSession()
  return (
    <div className="app-navigation">
      <div className="app-navigation-container">
        <SidebarProfile session={session} />
        <Navigation menus={sidebar_options._profile} />
        <Navigation menus={sidebar_options._profile_about} withLogin />
      </div>
    </div>
  )
}

export default ProfilePageIndex
