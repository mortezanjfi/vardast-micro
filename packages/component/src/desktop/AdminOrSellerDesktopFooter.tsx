import Image from "next/image"
import aparatColorful from "@vardast/asset/aparatColorful.svg"
import bazar from "@vardast/asset/bazar.svg"
import instagramColorful from "@vardast/asset/instagramColorful.svg"
import logoHorizontal from "@vardast/asset/logo-horizontal-v2-persian-dark-bg-white.svg"
import myket from "@vardast/asset/myket.svg"
import telegramColorful from "@vardast/asset/telegramColorful.svg"
import whatsAppColorful from "@vardast/asset/whatsAppColorful.svg"
import clsx from "clsx"

import Link from "../Link"

type Props = { isAdmin?: boolean }

export default function AdminOrSellerDesktopFooter({ isAdmin }: Props) {
  return (
    <footer
      className={clsx(
        " text-alpha-white",
        isAdmin ? "bg-secondary" : "bg-primary"
      )}
    >
      <div className="container mx-auto flex flex-col items-center justify-center gap-y-7 px-6 py-9">
        <div className="w-[150px]">
          <Image
            alt={`${process.env.NEXT_PUBLIC_TITLE} - ${process.env.NEXT_PUBLIC_SLOGAN}`}
            className="w-full object-contain"
            priority
            src={logoHorizontal}
          />
        </div>

        <div className="flex items-center justify-center gap-x-2">
          <Link
            className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-alpha-200 bg-alpha-white p-2 "
            href="https://www.instagram.com/vardastcom/?igsh=MW50dHRjeDJzY3Fqcg%3D%3D"
            prefetch={false}
            target="_blank"
          >
            <Image
              alt="instagram"
              className="w-full object-contain"
              priority
              src={instagramColorful}
            />
          </Link>
          <Link
            className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-alpha-200 bg-alpha-white p-2"
            href="https://t.me/+9890227272823"
            prefetch={false}
            target="_blank"
          >
            <Image
              alt="telegram"
              className="w-full object-contain"
              priority
              src={telegramColorful}
            />
          </Link>
          <Link
            className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-alpha-200 bg-alpha-white p-2"
            href="https://wa.me/+9890227272823"
            prefetch={false}
            target="_blank"
          >
            <Image
              alt="whatsapp"
              className="w-full object-contain"
              priority
              src={whatsAppColorful}
            />
          </Link>
          <Link
            className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-alpha-200 bg-alpha-white p-2 "
            href="https://www.aparat.com/vardast.com"
            prefetch={false}
            target="_blank"
          >
            <Image
              alt="instagram"
              className="w-full object-contain"
              priority
              src={aparatColorful}
            />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-x-9">
          <Link
            className="w-[135px]"
            href="http://cafebazaar.ir/app/?id=com.vardast.twa&ref=share"
            prefetch={false}
            target="_blank"
          >
            <Image
              alt="bazar"
              className="w-full object-contain"
              priority
              src={bazar}
            />
          </Link>
          <Link
            className="w-[135px]"
            href="https://myket.ir/app/com.vardast.twa"
            prefetch={false}
            target="_blank"
          >
            <Image
              alt="myket"
              className="w-full object-contain"
              priority
              src={myket}
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 justify-center gap-9 text-center sm:flex">
          <Link
            href="https://blog.vardast.com"
            prefetch={false}
            target="_blank"
          >
            بلاگ وردست
          </Link>
          <Link href="/contact" prefetch={false}>
            تماس با ما
          </Link>
          <Link href="/about" prefetch={false}>
            درباره ما
          </Link>
          <Link href="/privacy" prefetch={false}>
            قوانین و مقررات
          </Link>
          <Link href="/faq" prefetch={false}>
            سوالات متداول
          </Link>
          <Link
            href={process.env.NEXT_PUBLIC_SELLER_VARDAST}
            prefetch={false}
            target="_blank"
          >
            فروشنده شوید!
          </Link>
        </div>
        <p className="text-center">
          تمام حقوق اين وب‌سايت برای شرکت خلق ارزش مهستان (وردست) محفوظ است.
        </p>

        <p>Vardast.com | 2023 - 2024</p>
      </div>
    </footer>
  )
}
