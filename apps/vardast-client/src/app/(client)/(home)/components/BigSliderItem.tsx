"use client"

import { useState } from "react"
import Image from "next/image"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import CardAvatar from "@vardast/component/CardAvatar"
import Link from "@vardast/component/Link"
import clsx from "clsx"

import { ICategoryListLoader } from "@/app/(client)/category/components/CategoryListLoader"

export type SliderItemProps = {
  data: {
    id: number
    imageUrl?: string
    avatarUrl?: string
    name: string
    href: string
    sum: any
  }
}

const BigSliderItem = ({ data }: SliderItemProps) => {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)

  return (
    <Link
      onClick={() => {
        setSelectedItemId(data.id)
      }}
      prefetch={false}
      className={clsx(
        "flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-alpha-white shadow-lg",
        selectedItemId === data.id
          ? "border-2 border-primary"
          : "border-alpha-50"
      )}
      href={data.href}
    >
      <div className={clsx("relative h-[110vw] w-full sm:h-[350px]")}>
        <Image
          src={data.imageUrl ?? ""}
          alt="category"
          fill
          // width={300}
          // height={400}
          className="object-fill"
        />
      </div>
      <div className="relative z-20 flex items-center justify-between bg-alpha-50 bg-opacity-60 px py-4 text-center font-semibold">
        <CardAvatar url={data.avatarUrl ?? ""} name={data.name} />
        <h5 className="text-primary">
          {data.sum ? `${digitsEnToFa(data.sum)} کالا` : ""}
        </h5>
      </div>
    </Link>
  )
}

export default BigSliderItem
