"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import paths from "@vardast/lib/paths"
import { Button } from "@vardast/ui/button"
import clsx from "clsx"
import { LucideX } from "lucide-react"
import { useSession } from "next-auth/react"

const pdfBlogUrl = "https://gateway.vardast.com/Gozareshmaskan1403.pdf"

type HomeNotificationProps = {}

const HomeNotification = (_: HomeNotificationProps) => {
  const [downloadPdfModal, setDownloadPdfModal] = useState(false)
  const pathname = usePathname()
  const session = useSession()
  const router = useRouter()

  const setLocalStoragePdf = (finish?: boolean) => {
    const pdfCount = localStorage.getItem("pdf")
    localStorage.setItem(
      "pdf",
      finish ? "3" : pdfCount ? `${+pdfCount + 1}` : "1"
    )
  }

  const downloadPdf = (e) => {
    e.preventDefault()
    setLocalStoragePdf(true)
    if (session?.data) {
      window.location.href = pdfBlogUrl
      return
    }
    router.replace(`${paths.signin}?ru=${pdfBlogUrl}`)
  }

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (!localStorage.getItem("pdf") ||
        (localStorage.getItem("pdf") && localStorage.getItem("pdf") !== "3")) &&
      pathname === "/"
    ) {
      setTimeout(() => {
        setDownloadPdfModal(true)
      }, 2000)
    }
  }, [pathname])

  return (
    <>
      {downloadPdfModal && pathname === "/" && (
        <div
          className={clsx(
            "fixed bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] left-0 right-0 z-50 flex w-full max-w-[500px] transform cursor-pointer items-center justify-between gap-x bg-info px-6 py transition-all md:bottom-10 md:right-10 md:ml-auto md:rounded-lg md:px-12 md:py-4"
          )}
          onClick={downloadPdf}
        >
          <Button
            className="absolute -top-5 right-5 h-7 w-7 !bg-secondary-800"
            iconOnly
            size="small"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              e.nativeEvent.preventDefault()
              e.nativeEvent.stopImmediatePropagation()
              setLocalStoragePdf()
              setDownloadPdfModal(false)
            }}
          >
            <LucideX className="h-full w-full text-alpha-white" />
          </Button>
          <p className="text-center text-lg font-bold text-alpha-white">
            آخرین گزارش معاملات مسکن در تهران
            <br />
            <span className="text-sm">(فروردین ۱۴۰۳)</span>
          </p>
          <Button
            // loading={createEventTrackerDownloadPdfMutation.isLoading}
            // disabled={createEventTrackerDownloadPdfMutation.isLoading}
            className="!bg-error !px-5 !py-3 font-bold"
            size="small"
            variant="primary"
          >
            دانلود
          </Button>
        </div>
      )}
    </>
  )
}

export default HomeNotification
