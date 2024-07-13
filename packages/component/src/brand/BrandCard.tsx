"use client"

import "@heroicons/react/24/solid"

import { forwardRef, Ref, useRef, useState } from "react"
import Image from "next/image"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import clsx from "clsx"
import { Check, Minus } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { Brand } from "../../../graphql/src/generated"
import CardAvatar from "../CardAvatar"
import { ICategoryListLoader } from "../category/CategoryListLoader"
import Link from "../Link"

export type BrandCardProps = {
  isMobileView?: boolean
  brand: Brand
}

const BrandCard = forwardRef(
  <T extends Brand>(
    {
      isMobileView,
      brand
    }: {
      isMobileView?: boolean
      brand: Brand
    },

    ref: Ref<HTMLAnchorElement> | undefined
  ) => {
    const { t } = useTranslation()
    const [selectedItemId, setSelectedItemId] =
      useState<ICategoryListLoader>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    return (
      <Link
        ref={ref}
        onClick={() => {
          setSelectedItemId(brand?.id)
        }}
        className={clsx(
          "flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-alpha-white"
          // selectedItemId === brand?.id
          //   ? "border-2 border-primary"
          //   : "border-alpha-50"
        )}
        href={`/brand/${brand?.id}`}
      >
        <div
          ref={containerRef}
          className={clsx(
            "relative",
            isMobileView ? " h-[50vw] w-full" : "h-[200px]"
          )}
        >
          <Image
            src={brand?.bannerDesktop?.presignedUrl?.url ?? ""}
            alt="category"
            fill
            // width={300}
            // height={400}
            className="rounded-2xl object-fill"
          />
        </div>

        <div className="relative z-20 flex items-center gap-4  bg-opacity-60  pt-4 text-center font-semibold">
          <CardAvatar url={brand?.logoFile?.presignedUrl?.url ?? ""} />
          <div className="flex flex-col items-start gap-2">
            <h1 className="te text-base font-semibold">{brand?.name}</h1>

            <div className="flex divide-x divide-x-reverse divide-alpha-400 text-sm">
              {brand?.sum > 0 && (
                <div className="pl-2 text-sm font-medium text-alpha-500">
                  {digitsEnToFa(brand?.sum)} کالا
                </div>
              )}
              <div className="flex items-center gap-1 px-2 text-sm font-medium text-alpha-500">
                {t("common:catalog")}
                {brand?.catalog?.id ? (
                  <Check width={15} height={15} />
                ) : (
                  <Minus width={15} height={15} />
                )}
              </div>
              <div className="flex items-center gap-1 px-2 text-sm font-medium text-alpha-500">
                {t("common:price_list")}
                {brand?.priceList?.id ? (
                  <Check width={15} height={15} />
                ) : (
                  <Minus width={15} height={15} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
)

export default BrandCard
