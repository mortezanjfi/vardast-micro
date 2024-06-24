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
      variants={{
        hidden: { opacity: 0, y: 10, x: 0 },
        enter: { opacity: 1, y: 0, x: 0 }
      }}
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      ref={ref}
      className={clsx("app-content mobile")}
    >
      {children}
    </MotionSection>
  )
}

export default MobileScrollProvider
