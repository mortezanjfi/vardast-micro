"use client"

import { Dispatch, Suspense, useEffect } from "react"
import Image from "next/image"
import { usePathname, useSearchParams } from "next/navigation"
import { useClickOutside } from "@mantine/hooks"
import logo from "@vardast/asset/logo-horizontal-v2-persian-light-bg.svg"
import { NavigationType } from "@vardast/type/Navigation"
import clsx from "clsx"
import { SetStateAction } from "jotai"

import Navigation from "./Navigation"
import UserMenu from "./UserMenu"

type SidebarProps = {
  open: boolean
  onOpenChanged: Dispatch<SetStateAction<boolean>>
  menus: NavigationType[]
  isAdmin: boolean
}

const Sidebar = ({ menus, open, onOpenChanged, isAdmin }: SidebarProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // const [isOpen, setIsOpen] = useState<boolean>(false)
  const ref = useClickOutside(() => {
    if (open) {
      onOpenChanged(false)
      // setIsOpen(false)
    }
  })

  useEffect(() => {
    onOpenChanged(false)
    // setIsOpen(false)
  }, [onOpenChanged, pathname, searchParams])

  return (
    <>
      {open && (
        <div className="pointer-events-none fixed inset-0 z-50 h-full w-full bg-alpha-800 bg-opacity-40"></div>
      )}
      <div
        ref={ref}
        className={clsx(["app-sidebar bg-alpha-white", open ? "open" : ""])}
      >
        <div className="app-sidebar-inner">
          {/* <SpacesBar /> */}
          <div className="app-navigation">
            <div className="flex h-full w-full flex-col">
              <div className="flex h-full flex-col gap-9 px-4">
                {/* <OrganizationMenu /> */}
                {!isAdmin && (
                  <>
                    <div>
                      <Image src={logo} alt={`وردست`} />
                    </div>
                    <hr />
                  </>
                )}

                <div className="app-navigation-container">
                  <Navigation menus={menus} />
                </div>
                {isAdmin && (
                  <Suspense>
                    <UserMenu />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
