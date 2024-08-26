 
"use client"

import { redirect, usePathname } from "next/navigation"
import Navigation from "@vardast/component/Navigation"
import { SidebarProfile } from "@vardast/component/Sidebar"
import paths from "@vardast/lib/paths"
import sidebar_options from "@vardast/lib/sidebar_options"
import { useSession } from "next-auth/react"

const ProfilePageIndex = () => {
  const { data: session, status } = useSession()

  const pathname = usePathname()
  if (!session?.profile || status === "unauthenticated")
    redirect(`${paths.signin}?ru=${pathname}`)

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
