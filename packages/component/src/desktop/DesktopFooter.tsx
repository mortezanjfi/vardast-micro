import Image from "next/image"
import aparatColorful from "@vardast/asset/aparatColorful.svg"
import bazar from "@vardast/asset/bazar.svg"
import instagramColorful from "@vardast/asset/instagramColorful.svg"
import logoHorizontal from "@vardast/asset/logo-horizontal-v2-persian-dark-bg-white.svg"
import myket from "@vardast/asset/myket.svg"
import telegramColorful from "@vardast/asset/telegramColorful.svg"
import whatsAppColorful from "@vardast/asset/whatsAppColorful.svg"

import Link from "../Link"

type Props = {}

export default function DesktopFooter({}: Props) {
  return (
    <footer className="bg-secondary text-alpha-white">
      <div className="container mx-auto flex flex-col items-center justify-center gap-y-7 px-6 py-9">
        <div className="w-[150px]">
          <Image
            src={logoHorizontal}
            alt={`${process.env.NEXT_PUBLIC_TITLE} - ${process.env.NEXT_PUBLIC_SLOGAN}`}
            className="w-full object-contain"
            priority
          />
        </div>

        <div className="flex items-center justify-center gap-x-2">
          <Link
            prefetch={false}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-alpha-200 bg-alpha-white p-2 "
            href="https://www.instagram.com/vardastcom/?igsh=MW50dHRjeDJzY3Fqcg%3D%3D"
            target="_blank"
          >
            <Image
              src={instagramColorful}
              alt="instagram"
              className="w-full object-contain"
              priority
            />
          </Link>
          <Link
            prefetch={false}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-alpha-200 bg-alpha-white p-2"
            href="https://t.me/+9890227272823"
            target="_blank"
          >
            <Image
              src={telegramColorful}
              alt="telegram"
              className="w-full object-contain"
              priority
            />
          </Link>
          <Link
            prefetch={false}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-alpha-200 bg-alpha-white p-2"
            href="https://wa.me/+9890227272823"
            target="_blank"
          >
            <Image
              src={whatsAppColorful}
              alt="whatsapp"
              className="w-full object-contain"
              priority
            />
          </Link>
          <Link
            prefetch={false}
            className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-alpha-200 bg-alpha-white p-2 "
            href="https://www.aparat.com/vardast.com"
            target="_blank"
          >
            <Image
              src={aparatColorful}
              alt="instagram"
              className="w-full object-contain"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-x-9">
          <Link
            prefetch={false}
            className="w-[135px]"
            href="http://cafebazaar.ir/app/?id=com.vardast.twa&ref=share"
            target="_blank"
          >
            <Image
              src={bazar}
              alt="bazar"
              className="w-full object-contain"
              priority
            />
          </Link>
          <Link
            prefetch={false}
            className="w-[135px]"
            href="https://myket.ir/app/com.vardast.twa"
            target="_blank"
          >
            <Image
              src={myket}
              alt="myket"
              className="w-full object-contain"
              priority
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 justify-center gap-9 text-center sm:flex">
          <Link
            prefetch={false}
            href="https://blog.vardast.com"
            target="_blank"
          >
            بلاگ وردست
          </Link>
          <Link prefetch={false} href="/contact">
            تماس با ما
          </Link>
          <Link prefetch={false} href="/about">
            درباره ما
          </Link>
          <Link prefetch={false} href="/privacy">
            قوانین و مقررات
          </Link>
          <Link prefetch={false} href="/faq">
            سوالات متداول
          </Link>
          <Link
            prefetch={false}
            href={process.env.NEXT_PUBLIC_SELLER_VARDAST as string}
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
