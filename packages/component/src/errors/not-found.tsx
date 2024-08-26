import Image from "next/image"
import image404 from "@vardast/asset/404.svg"

import Link from "../Link"

function NotFound() {
  return (
    <div
      className="flex h-screen w-full flex-col items-center justify-center"
      dir="rtl"
    >
      <div>
        <Image
          alt="صفحه مورد نظر شما پیدا نشد"
          className="mb-12"
          src={image404}
        />
        <h2 className="font-bold text-alpha-800">همم!</h2>
        <p className="text-alpha-700">صفحه مورد نظر شما پیدا نشد</p>
        <div className="mt-8 flex flex-col gap-6">
          <Link className="inline-block text-sm text-primary-500" href="/">
            برگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
