"use client"

import { ReactNode, Suspense, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Search from "@vardast/component/search"
import Sidebar from "@vardast/component/Sidebar"
import { GetMyProfileSellerQuery } from "@vardast/graphql/generated"
import { _sellerSidebarMenu } from "@vardast/lib/constants"
import { getMyProfileSellerQueryFns } from "@vardast/query/queryFns/getMyProfileSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { Avatar, AvatarFallback, AvatarImage } from "@vardast/ui/avatar"
import { Button } from "@vardast/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@vardast/ui/navigation-menu"
import { LucideLogOut, LucideMenu } from "lucide-react"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"

import SelllerBreadcrumb from "@/app/(seller)/components/SellerBreadCrumb"

type SellerLayoutComponentProps = {
  children: ReactNode
  session: Session | null
}

const SellerLayoutComponent = ({
  children,
  session
}: SellerLayoutComponentProps) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

  const myProfileQuery = useQuery<GetMyProfileSellerQuery>(
    [QUERY_FUNCTIONS_KEY.GET_M_PROFILE_SELLER],
    () =>
      getMyProfileSellerQueryFns({
        accessToken: session?.accessToken
      }),
    {
      refetchOnMount: "always"
    }
  )

  return (
    <div className="app flex h-full overflow-y-scroll bg-alpha-white md:overflow-y-auto">
      <div className="app-inner">
        <Sidebar
          isAdmin={false}
          menus={_sellerSidebarMenu}
          open={sidebarOpen}
          onOpenChanged={setSidebarOpen}
        />

        <div className="flex w-full flex-col">
          <div className="flex max-h-24 !min-h-24 w-full justify-between border-b px-7 py-5">
            <div className="w-[460px]">
              {" "}
              <Search isMobileView={false} />
            </div>

            <div className="h-full">
              <NavigationMenu className="h-full">
                <NavigationMenuList className="flex h-full gap-7">
                  {/* <NavigationMenuItem>
                    <div className=" flex h-[44px] w-[44px] items-center justify-center rounded-full border">
                      <ChatBubbleLeftEllipsisIcon className="h-7 w-7" />
                    </div>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <div className=" flex h-[44px] w-[44px] items-center justify-center rounded-full border">
                      <BellIcon className="h-7 w-7" />
                    </div>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <hr className="h-[44px] w-[2px] bg-alpha-200"></hr>
                  </NavigationMenuItem> */}
                  <NavigationMenuItem className="flex items-center gap-9">
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="medium"
                        className=" rounded-full border border-secondary"
                      >
                        <AvatarImage
                          src={
                            myProfileQuery.data?.myProfileSeller.logoFile
                              ?.presignedUrl.url
                          }
                          alt="seller"
                        />

                        <AvatarFallback>
                          {session?.profile?.firstName &&
                            session?.profile?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="ms-2 font-medium text-alpha-800">
                          {session?.profile.fullName}
                        </span>
                        <span>{session?.profile.displayRole.displayName}</span>
                      </div>
                    </div>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger></NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink className="md: z-50 flex w-48 justify-center text-nowrap bg-alpha-white p-2">
                        <Button
                          onClick={() =>
                            signOut({
                              callbackUrl: "/"
                            })
                          }
                          variant="ghost"
                          className="justify-start text-start"
                        >
                          خروج
                          <LucideLogOut className="icon" />
                        </Button>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="max-h-20  w-full flex-1 !items-center px-6 py-3">
            <Suspense>
              <SelllerBreadcrumb />
            </Suspense>
          </div>
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
              <div className="mx-auto flex w-full flex-col gap-7 p-7 md:max-w-[1322px]">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerLayoutComponent
