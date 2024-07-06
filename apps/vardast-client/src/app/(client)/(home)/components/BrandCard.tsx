"use client"

import "@heroicons/react/24/solid"

import { forwardRef, Ref, useRef, useState } from "react"
import Image from "next/image"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import CardAvatar from "@vardast/component/CardAvatar"
import { ICategoryListLoader } from "@vardast/component/category/CategoryListLoader"
import Link from "@vardast/component/Link"
import { Brand } from "@vardast/graphql/generated"
import clsx from "clsx"
import { CheckIcon, Minus } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

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
          "flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-alpha-white shadow-lg",
          selectedItemId === brand?.id
            ? "border-2 border-primary"
            : "border-alpha-50"
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
            className="object-fill"
          />
        </div>

        <div className="relative z-20 flex items-center gap-4 bg-alpha-50 bg-opacity-60 px py-4 text-center font-semibold">
          <CardAvatar url={brand?.logoFile?.presignedUrl?.url ?? ""} />
          <div className="flex flex-col items-start gap-2">
            <span>{brand?.name}</span>
            <div className="flex text-sm font-normal text-alpha-500">
              <div className="flex items-center gap-1 border-l-0.5 pl-2">
                <span>{t("common:catalog")}</span>
                <span>
                  {brand?.catalog?.id ? (
                    <CheckIcon width={16} height={16} />
                  ) : (
                    <Minus width={16} height={16} />
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1 p-2 ">
                {" "}
                <span>{t("common:price_list")}</span>
                <span>
                  {brand?.priceList?.id ? (
                    <CheckIcon width={16} height={16} />
                  ) : (
                    <Minus width={16} height={16} />
                  )}
                </span>
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="tag  tag-secondary text-sm font-medium">
                {digitsEnToFa(brand?.sum)} کالا
              </span>
              {brand?.categoriesCount && (
                <span className="tag  tag-secondary text-sm font-medium">
                  {digitsEnToFa(brand?.categoriesCount)} دسته بندی
                </span>
              )}
              {brand?.sellersCount && (
                <span className="tag  tag-secondary text-sm font-medium">
                  {digitsEnToFa(brand?.sellersCount)} فروشنده
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }
)

export default BrandCard
