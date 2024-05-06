"use client"

import { useEffect, useState } from "react"
import { ArrowUpOnSquareIcon, PlusIcon } from "@heroicons/react/24/outline"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useToast } from "@vardast/hook/use-toast"
import { Button } from "@vardast/ui/button"
import { Drawer, DrawerContent } from "@vardast/ui/drawer"

type Props = {
  isMobileView: boolean
}

export default function PwaNotificationProvider({ isMobileView }: Props) {
  const [pwaModal, setPwaModal] = useState(false)
  const { toast, dismiss } = useToast()

  const isPwa = () => {
    return ["fullscreen", "standalone", "minimal-ui"].some(
      (displayMode) =>
        window.matchMedia("(display-mode: " + displayMode + ")").matches
    )
  }

  const onOpenChange = () => {
    setPwaModal(false)
    localStorage.setItem("pwa", "true")
  }

  const OpenDesktopToast = () => {
    return (
      <div className="mx-auto text-justify leading-8">
        <p className="text-center text-2xl font-bold">
          بهبود تجربه کاربری با وردست PWA
        </p>
        <p className="mt-6">
          برای بهبود تجربه کاربری، لطفاً وبسایت وردست را از طریق مرورگر موبایل
          باز کنید و سپس نسخهٔ نصب‌پذیر (PWA) را نصب نمایید.
        </p>
        <ol className="list-item list-inside">
          <li className="mb-2">
            {digitsEnToFa(1)}- باز کردن وبسایت از طریق مرورگر موبایل.
          </li>
          <li className="mb-2">
            {digitsEnToFa(2)}- جستجو برای گزینه‌های نصب یا اضافه به صفحه اصلی.
          </li>
          <li className="mb-2">
            {digitsEnToFa(3)}- انتخاب گزینه مربوط به نصب نسخه PWA.
          </li>
        </ol>
        <p className="">
          حالا با استفاده از نسخه PWA، به راحتی و با سرعت به وبسایت وردست دسترسی
          پیدا کنید و از تجربه بهتری بهره‌مند شوید.
        </p>
        <div className="flex justify-end pt-4">
          <Button
            onClick={() => {
              dismiss()
              onOpenChange()
            }}
            // variant="secondary"
          >
            متوجه شدم
          </Button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !isPwa() &&
      !localStorage.getItem("pwa")
    ) {
      setTimeout(() => {
        if (isMobileView) {
          setPwaModal(true)
        } else {
          toast({
            description: <OpenDesktopToast />,
            duration: 50000,
            variant: "secondary"
          })
        }
      }, 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isMobileView) {
    return (
      <Drawer open={pwaModal} onClose={onOpenChange}>
        <DrawerContent className="bg-alpha-white">
          <div className="flex h-full flex-col">
            <div className="flex flex-1 flex-col justify-center gap-y overflow-y-scroll p text-center">
              {/* <Image
              src={logoLogo}
              alt={process.env.NEXT_PUBLIC_TITLE as string}
              className="mx-auto h-44 w-44"
            /> */}
              <p className="text-lg leading-8">
                نسخه وب اپلیکیشن (PWA) وردست را به صفحه اصلی اضافه کنید
              </p>
              <ul className="list-inside text-right font-bold leading-10">
                <li className="flex justify-between">
                  <p>
                    1- روی دکمه{" "}
                    <span className="px-2 font-bold text-primary">Share</span>{" "}
                    کلیک کنید.
                  </p>
                  <span className="my-auto">
                    <ArrowUpOnSquareIcon className="w-7 opacity-50" />
                  </span>
                </li>
                <li className="flex justify-between">
                  <p>
                    2- روی دکمه{" "}
                    <span className="px-2 font-bold text-primary">
                      Add to Home Screen
                    </span>{" "}
                    کلیک کنید.
                  </p>
                  <span className="my-auto opacity-50">
                    <PlusIcon className="w-7" />
                  </span>
                </li>
                <li className="flex justify-between">
                  <p>
                    3- در پنجره باز شده روی{" "}
                    <span className="px-2 font-bold text-primary">Add</span>{" "}
                    کلیک کنید.
                  </p>
                </li>
              </ul>
            </div>
            <div className="p">
              <Button block onClick={onOpenChange}>
                متوجه شدم
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return <></>
}
