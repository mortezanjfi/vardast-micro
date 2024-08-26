"use client"

import { PropsWithChildren, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"

import { MotionSection } from "../motion/Motion"

const MobileScrollProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  }, [pathname])

  return (
    <MotionSection
      animate="enter" // Animated state to variants.enter
      className={clsx("app-content mobile")}
      exit="exit" // Exit state (used later) to variants.exit
      initial="hidden" // Set the initial state to variants.hidden
      ref={ref}
      transition={{ type: "linear" }} // Set the transition to linear
      variants={{
        hidden: { opacity: 0, y: 10, x: 0 },
        enter: { opacity: 1, y: 0, x: 0 }
      }}
    >
      {children}
    </MotionSection>
  )
}

export default MobileScrollProvider
