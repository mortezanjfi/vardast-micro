"use client"

import "@heroicons/react/24/solid"

import { useState } from "react"
import Image from "next/image"
import CardAvatar from "@vardast/component/CardAvatar"
import { ICategoryListLoader } from "@vardast/component/category/CategoryListLoader"
import Link from "@vardast/component/Link"
import { Brand } from "@vardast/graphql/generated"
import clsx from "clsx"
import { CheckIcon, Minus } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

export type SliderItemProps = {
  isMobileView?: boolean
  brand: Brand
}

const BigSliderItem = ({ isMobileView, brand }: SliderItemProps) => {
  const { t } = useTranslation()
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)

  return (
    <Link
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
        className={clsx(
          "relative",
          isMobileView ? "h-[50vw] w-full" : "h-[200px]"
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
          <div className="flex  text-sm text-alpha-500">
            <div className="flex items-center gap-1 border-l-0.5 pl-2">
              <span>{t("common:catalog")}</span>
              <span>
                {brand?.catalog?.id ? (
                  <CheckIcon width={10} height={10} />
                ) : (
                  <Minus />
                )}
              </span>
            </div>
            <div className="flex items-center gap-1 p-2">
              {" "}
              <span>{t("common:price_list")}</span>
              <span>
                {brand?.priceList?.id ? (
                  <CheckIcon width={10} height={10} />
                ) : (
                  <Minus />
                )}
              </span>
            </div>
          </div>
          <div className="flex gap-2 text-sm">
            <h5 className="tag tag-secondary text-sm">{brand?.sum} کالا</h5>
            {brand?.categoriesCount && (
              <h5 className="tag tag-secondary text-sm">
                {brand?.categoriesCount} دسته بندی
              </h5>
            )}
            {brand?.sellersCount && (
              <h5 className="tag tag-secondary text-sm">
                {brand?.sellersCount} فروشنده
              </h5>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BigSliderItem
