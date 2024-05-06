"use client"

import { useEffect } from "react"
import Error from "next/error"

export default function GlobalError({ error }) {
  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <html>
      <body>
        <Error />
      </body>
    </html>
  )
}
