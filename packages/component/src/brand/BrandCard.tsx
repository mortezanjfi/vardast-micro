"use client"

import "@heroicons/react/24/solid"

import { forwardRef, Ref, useRef, useState } from "react"
import Image from "next/image"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import brandSellerBlank from "@vardast/asset/brand-seller-blank.svg"
import frameLessImage from "@vardast/asset/images/frameLess.png"
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

export const BrandCardSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col lg:px-4">
      <div className="grid flex-1 items-start sm:grid-rows-7 sm:py lg:flex lg:flex-col">
        <div
          className={`relative row-span-4 h-[50vw] w-full transform transition-all sm:py  md:h-[127px] lg:h-[174px]  xl:h-[127px] 2xl:h-[138px] `}
        >
          <Image
            src={frameLessImage}
            alt="skeleton"
            fill
            className="animated-card object-contain"
          />
        </div>
        <div className="relative z-20 flex w-full items-center gap-4  pt-4">
          <div
            className={clsx(
              "animated-card relative h-14 w-14 flex-shrink-0 rounded-full border border-alpha-400 bg-alpha-50 p-1"
            )}
          ></div>

          <div className="flex w-full flex-col items-start gap-2">
            <span className=" animated-card h-7 w-1/2 text-base font-semibold"></span>
            <span className="animated-card h-6 w-full pl-2"></span>
          </div>
        </div>
      </div>
    </div>
  )
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
          "flex h-full flex-col overflow-hidden rounded-2xl bg-alpha-white"
          // selectedItemId === brand?.id
          //   ? "border-2 border-primary"
          //   : "border-alpha-50"
        )}
        href={`/brand/${brand?.id}?orderBy=NEWEST`}
      >
        <div
          ref={containerRef}
          className={clsx(
            "relative h-[127px] lg:h-[174px]  xl:h-[127px]  2xl:h-[138px]",
            isMobileView && "w-full"
          )}
        >
          <Image
            src={
              brand?.bannerDesktop?.presignedUrl?.url
                ? brand?.bannerDesktop?.presignedUrl?.url
                : brandSellerBlank
            }
            alt="category"
            fill
            // width={300}
            // height={400}
            className={clsx(
              "transform rounded-2xl object-fill transition",
              selectedItemId === brand?.id ? "border-2 border-primary" : ""
            )}
          />
        </div>

        <div className="relative z-20 flex items-center gap-4  bg-opacity-60  pt-4 text-center font-semibold">
          <CardAvatar url={brand?.logoFile?.presignedUrl?.url ?? ""} />
          <div className="flex flex-col items-start gap-2">
            <h1 className=" text-base font-semibold">{brand?.name}</h1>

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
