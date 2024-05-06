"use client"

import { useState } from "react"
import { useRouteChange } from "@vardast/provider/RouteChangeProvider"
import clsx from "clsx"

export default function Progress({ reverseBg = false }) {
  const [progress, setProgress] = useState(0)
  const [hasFinished, setHasFinished] = useState(true)

  let timer: any

  function increment() {
    const timeout = Math.round(Math.random() * 300)

    setProgress((progress) => {
      const percent = Math.round(Math.random() * 10)
      const next = Math.min(progress + percent, 90)

      if (next < 90) {
        timer = setTimeout(increment, timeout)
        return next
      }

      return 90
    })
  }

  function start() {
    setProgress(1)
    setHasFinished(false)
    increment()
  }

  function complete() {
    setHasFinished(true)
    setProgress(0)
    clearTimeout(timer)
  }

  useRouteChange({
    onRouteChangeStart: () => {
      start()
    },
    onRouteChangeComplete: () => {
      complete()
    }
  })

  return (
    <div className="absolute bottom-0.5 left-0 z-[999999] h-0.5 w-full rounded-full">
      <div
        className={clsx(
          "absolute bottom-0 left-0.5 top-0 w-0 transform rounded-full transition-all",
          reverseBg ? "bg-alpha-white" : "bg-primary"
        )}
        style={{
          width: hasFinished ? 0 : `${progress}%`,
          opacity: hasFinished ? 0 : 1
        }}
      />
    </div>
  )
}
