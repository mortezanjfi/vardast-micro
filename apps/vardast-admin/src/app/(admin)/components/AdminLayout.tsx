"use client"

import { ReactNode, Suspense, useState } from "react"
import Breadcrumb from "@vardast/component/Breadcrumb"
import Sidebar from "@vardast/component/Sidebar"
import { _sidebarMenu } from "@vardast/lib/constants"
import { Button } from "@vardast/ui/button"
import { LucideMenu } from "lucide-react"

type AdminLayoutComponentProps = {
  children: ReactNode
}

const AdminLayoutComponent = ({ children }: AdminLayoutComponentProps) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  return (
    <div className="md:app w-full bg-alpha-50">
      <div className=" hide-scrollbar h-full w-full flex-col overflow-y-scroll  pb-8 lg:container md:overflow-y-auto">
        <div className="app-inner gap-3 pb-5 pt">
          <Sidebar
            open={sidebarOpen}
            onOpenChanged={setSidebarOpen}
            menus={_sidebarMenu}
            isAdmin={true}
          />
          <div className="flex w-full flex-col">
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

export default AdminLayoutComponent
