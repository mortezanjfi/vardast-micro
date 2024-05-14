"use client"

import { ReactNode, Suspense, useState } from "react"
import Breadcrumb from "@vardast/component/Breadcrumb"
import Sidebar from "@vardast/component/Sidebar"
import { _profileSidebarMenu } from "@vardast/lib/constants"
import { Button } from "@vardast/ui/button"
import { LucideMenu } from "lucide-react"

type UserProfileLayoutProps = {
  children: ReactNode
  isMobileView: boolean
}

const UserProfileLayout = ({
  children,
  isMobileView
}: UserProfileLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  return (
    <>
      {isMobileView ? (
        children
      ) : (
        <div className="md:app h-full flex-col overflow-y-scroll bg-alpha-white pb-8 lg:container md:overflow-y-auto">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSidebarOpen(true)}
              variant="ghost"
              iconOnly
              className="lg:hidden"
            >
              <LucideMenu className="icon" />
            </Button>
            <div className="flex-1 overflow-y-auto">
              <Suspense>
                <Breadcrumb dynamic={true} isMobileView={isMobileView} />
              </Suspense>
            </div>
          </div>

          <div className="app-inner gap-8">
            <Sidebar
              isUserProfile={true}
              open={sidebarOpen}
              onOpenChanged={setSidebarOpen}
              menus={_profileSidebarMenu}
              isAdmin={false}
            />

            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default UserProfileLayout
