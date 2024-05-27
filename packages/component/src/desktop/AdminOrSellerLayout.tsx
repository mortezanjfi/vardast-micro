"use client"

import { ReactNode, Suspense, useState } from "react"
import { NavigationType } from "@vardast/type/src/Navigation"
import { Button } from "@vardast/ui/button"
import { LucideMenu } from "lucide-react"

import Breadcrumb from "../Breadcrumb"
import Sidebar from "../Sidebar"

type AdminOrSellerLayoutComponentProps = {
  menu: NavigationType[]
  children: ReactNode
}

const AdminOrSellerLayoutComponent = ({
  children,
  menu
}: AdminOrSellerLayoutComponentProps) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  return (
    <div className="hide-scrollbar min-h-full w-full overflow-y-scroll bg-alpha-50">
      <div className="h-full w-full flex-col  pb-8 lg:container md:overflow-y-auto">
        <div className="app-inner !max-w-full gap-3 pb-5 pt">
          <Sidebar
            open={sidebarOpen}
            onOpenChanged={setSidebarOpen}
            menus={menu}
            isAdmin={true}
          />
          <div className="flex h-full w-full !max-w-full flex-col overflow-x-hidden pb">
            <div className="flex items-center gap-2 pr-6">
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
                  <Breadcrumb dynamic />
                </Suspense>
              </div>
            </div>{" "}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrSellerLayoutComponent
