"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import sadFace from "@vardast/asset/sad-face.svg"
import { Button } from "@vardast/ui/button"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
  return (
    <div className="mx-auto flex h-screen w-full flex-col items-center justify-center">
      <div className="leading-relaxed">
        <Image src={sadFace} alt="Something went wrong!" />
        <h2 className="mt-4 font-bold">ببخشید!</h2>
        <h2>خطایی هنگام درست کردن صفحه رخ داده...</h2>
        <div className="flex flex-col gap-y">
          <Button onClick={() => reset()} className="mt-8">
            تلاش مجدد
          </Button>
          <Link href="/" className="inline-block text-sm text-primary-500">
            برگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  )
}
