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
      <div className="flex items-center justify-between">
        <PageHeader title={isMounted ? document.title : ""} />
        <div>
          <Button
            size="medium"
            variant="secondary"
            onClick={() => router.back()}
          >
            بازگشت
          </Button>
        </div>
      </div>
      {children}
    </div>
  )
}

export default TemplateActionButton
