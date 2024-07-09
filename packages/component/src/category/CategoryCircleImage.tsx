"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { clsx } from "clsx"

import { Category } from "../../../graphql/src/generated"
import { ICategoryListLoader } from "../../../type/src/Loader"

type CategoryCircleImageProps = {
  onClick?: (_?: any) => void
  category: Category
}

export const CategoryCircleImageSkeleton = () => {
  return (
    <div className={clsx("flex h-full flex-col justify-start gap-y-3")}>
      <div
        className={clsx(
          "animated-card  h-20  rounded-full border border-alpha-400 bg-alpha-50"
        )}
      ></div>
      <h5 className={clsx("flex h-12 flex-col items-center gap-2")}>
        <span className="animated-card h-3 w-8"></span>
        <span className="animated-card h-3 w-14"></span>
      </h5>
    </div>
  )
}

function CategoryCircleImage({ category }: CategoryCircleImageProps) {
  const [selectedItemId, setSelectedItemId] =
    useState<ICategoryListLoader>(null)
  const router = useRouter()

  const onClick = (id: number, title: string) => {
    setSelectedItemId(id)
    router.push(`/products/${id}/${title}`)
  }
  return (
    <div
      onClick={() => {
        onClick(category.id, category.title)
      }}
      className={clsx("flex h-full flex-col justify-start gap-y-3")}
    >
      <div
        className={clsx(
          "relative h-20 w-full overflow-hidden rounded-full border border-alpha-400 bg-alpha-50",
          category.id === selectedItemId ? "border-2 border-primary" : ""
        )}
      >
        <Image
          src={
            (category.imageCategory &&
              (category.imageCategory[0]?.file.presignedUrl?.url as string)) ??
            "" ??
            `/images/categories/${category.id}.png`
          }
          alt="category"
          fill
          className="rounded-xl object-contain"
        />
      </div>
      <h5
        className={clsx(
          "relative z-20 line-clamp-2 h-12 whitespace-pre-wrap bg-opacity-60 text-center text-sm font-semibold",
          category.id === selectedItemId ? "text-primary" : ""
        )}
      >
        {category.title}
      </h5>
    </div>
  )
}

export default CategoryCircleImage
