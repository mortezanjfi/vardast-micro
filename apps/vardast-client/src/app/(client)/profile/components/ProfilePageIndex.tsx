/* eslint-disable no-unused-vars */
"use client"

import Navigation from "@vardast/component/Navigation"
import { SidebarProfile } from "@vardast/component/Sidebar"
import sidebar_options from "@vardast/lib/sidebar_options"

const ProfilePageIndex = () => {
  return (
    <div className="app-navigation">
      <div className="app-navigation-container">
        <SidebarProfile />
        <Navigation menus={sidebar_options._profile} />
        <Navigation menus={sidebar_options._profile_about} withLogin />
      </div>
    </div>
  )
}

export default ProfilePageIndex
