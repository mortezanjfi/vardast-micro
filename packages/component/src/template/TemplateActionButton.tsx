"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@vardast/ui/button"

import PageHeader from "../PageHeader"

const TemplateActionButton = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const router = useRouter()
  return (
    <div className="flex h-full flex-col gap-6">
      <PageHeader title={isMounted ? document.title : ""} />
      {children}
      <div className="flex justify-end">
        <Button variant="secondary" size="medium" onClick={() => router.back()}>
          بازگشت
        </Button>
      </div>
    </div>
  )
}

export default TemplateActionButton
