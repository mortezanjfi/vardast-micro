"use client"

import { PropsWithChildren, useEffect, useState } from "react"
import Image from "next/image"
import logoHorizontal from "@vardast/asset/logo.gif"
import { motion } from "framer-motion"

const show = {
  opacity: 1
}

const hide = {
  transitionEnd: {
    opacity: 0,
    display: "none"
  }
}

const FakeSplashScreenProvider: React.FC<
  PropsWithChildren<{ isMobileView: boolean }>
> = ({ isMobileView, children }) => {
  const [mount, setMount] = useState(false)

  const onStartApp = () => {
    setTimeout(() => {
      setMount(true)
    }, 0)
  }

  useEffect(() => {
    onStartApp()
  }, [])

  if (!isMobileView || mount) {
    return <>{children}</>
  }

  return (
    <>
      <motion.div
        animate={mount ? show : hide}
        className="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-alpha-white"
      >
        <Image
          alt={`${process.env.NEXT_PUBLIC_TITLE} - ${process.env.NEXT_PUBLIC_SLOGAN}`}
          priority
          src={logoHorizontal}
        />
      </motion.div>
    </>
  )
}

export default FakeSplashScreenProvider
