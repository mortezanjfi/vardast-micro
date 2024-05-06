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
    <div className="app h-full overflow-y-scroll md:overflow-y-auto">
      <div className="app-inner">
        <Sidebar
          isAdmin={true}
          menus={_sidebarMenu}
          open={sidebarOpen}
          onOpenChanged={setSidebarOpen}
        />
        <div className="app-content">
          <div className="mx-auto flex w-full flex-col">
            <div className="mb-3 flex items-center gap-2">
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
                  <Breadcrumb />
                </Suspense>
              </div>
              {/* <form autoComplete="off" action="" className="mr-auto">
                <div className="form-control form-control-sm">
                  <div className="input-group">
                    <div className="input-inset">
                      <div className="input-element">
                        <LucideSearch />
                      </div>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="جستجو..."
                        autoComplete="off"
                        name="search"
                        tabIndex={-1}
                        role="presentation"
                      />
                      <div className="input-element" dir="ltr">
                        <span className="font-sans text-sm text-alpha-400">
                          ⌘K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form> */}
            </div>
            <div className="mx-auto w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayoutComponent
