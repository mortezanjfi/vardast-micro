"use client"

import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { WalletIcon } from "@heroicons/react/24/solid"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import sidebar_options from "@vardast/lib/sidebar_options"
import { ILayoutDesktopSidebar } from "@vardast/type/layout"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"

import Link from "../Link"
import Navigation from "../Navigation"

const SidebarProfile = ({ session }: { session: Session }) => {
  return (
    session?.profile?.status && (
      <ol className="app-navigation-section">
        <li className="app-navigation-item flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            {session?.profile?.fullName &&
            session?.profile?.fullName !== "null null" ? (
              <h4 className="font-semibold">{session?.profile?.fullName}</h4>
            ) : (
              "کاربر وردست"
            )}
            <p className="text-sm font-semibold text-alpha-400">
              {session?.profile?.cellphone
                ? digitsEnToFa(session?.profile?.cellphone)
                : digitsEnToFa("09123456789")}
            </p>
          </div>
          <Link href={"/profile/info"}>
            <PencilSquareIcon height={20} width={20} />
          </Link>
        </li>
        <li className="app-navigation-item flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-600 p-2">
              <WalletIcon
                width={24}
                height={24}
                className="text-alpha-white"
                color="alpha-white"
              />
            </div>
            <span>کیف پول</span>
          </div>
          <div className="text-alph-500 flex items-center gap-1">
            <span>{digitsEnToFa(addCommas(0))}</span>
            <span>تومان</span>
          </div>
        </li>
      </ol>
    )
  )
}

const PageNavigationSidebar = ({
  menus_name,
  profile
}: ILayoutDesktopSidebar) => {
  const { data: session } = useSession()

  return (
    <div className="app-navigation">
      <div className="app-navigation-container">
        {profile && <SidebarProfile session={session} />}
        <Navigation menus={sidebar_options[menus_name]} withLogin />
      </div>
    </div>
  )
}

export default PageNavigationSidebar
