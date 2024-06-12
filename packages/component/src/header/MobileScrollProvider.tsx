"use client"

import { PropsWithChildren, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"

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
    <div ref={ref} className={clsx("app-content mobile")}>
      {children}
    </div>
  )
}

export default MobileScrollProvider
