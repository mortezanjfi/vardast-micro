"use client"

import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"

const MobileScrollProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // const { showNavbar } = useContext(PublicContext)
  // const [realScrollbarHeight, setRealScrollbarHeight] = useState(0)
  // const setShowNavbarScroll = useSetAtom(showNavbar)
  // const [lastScrollTop, setLastScrollTop] = useState(0)
  const [navigationBarHeight, setNavigationBarHeight] = useState(0)
  const ref = useRef<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined") {
      // const scrollBarContainer =
      //   window?.document?.getElementById("scroll-container")
      // const scrollBarContainerScrollHeight = scrollBarContainer?.scrollHeight
      // const scrollBarContainerClientHeight = scrollBarContainer?.clientHeight
      // setRealScrollbarHeight(
      //   (scrollBarContainerScrollHeight || 0) -
      //     (scrollBarContainerClientHeight || 0)
      // )
      const navigationBar = window?.document?.getElementById(
        "mobile-navigation-bar"
      )
      const navigationBarScrollHeight = navigationBar?.scrollHeight

      setNavigationBarHeight(navigationBarScrollHeight || 0)
    }
    if (ref?.current) {
      ref.current.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  }, [pathname])

  return (
    <div
      id="scroll-container"
      // onScroll={(e: any) => {
      //   // var st = e.target?.scrollTop
      //   // const showNavbarFlag =
      //   //   st === 0 || st >= realScrollbarHeight ? true : st < lastScrollTop
      //   // setShowNavbarScroll(showNavbarFlag)
      //   // setLastScrollTop(st <= 0 ? 0 : st)
      // }}
      ref={ref}
      style={{
        // paddingBottom: `calc(env(safe-area-inset-bottom) + ${navigationBarHeight}px)`
        paddingBottom: navigationBarHeight
      }}
      className={clsx(`app-content mobile`)}
    >
      {children}
    </div>
  )
}

export default MobileScrollProvider
