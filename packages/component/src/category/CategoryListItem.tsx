import { forwardRef, Ref } from "react"
import Image from "next/image"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { checkSellerRedirectUrl } from "@vardast/util/checkSellerRedirectUrl"
import clsx from "clsx"

import Link from "../Link"
import { ICategoryListLoader } from "./CategoryListLoader"

interface IVocabularyItem {
  ref?: Ref<HTMLAnchorElement> | undefined
  className?: string
  title: string
  isSubCategory?: boolean
  id: number
  src: string
  productsCount?: number
  onClick?: (_?: any) => void
  selectedItemId?: ICategoryListLoader
  href: string
}

const CategoryListItem = forwardRef(
  (
    {
      className,
      title,
      src,
      productsCount,
      id,
      isSubCategory,
      onClick,
      selectedItemId,
      href
    }: IVocabularyItem,
    ref: Ref<HTMLAnchorElement> | undefined
  ) => {
    return (
      <Link
        ref={ref}
        href={checkSellerRedirectUrl(href)}
        className={clsx(
          "border !border-alpha-400",
          isSubCategory
            ? "h-[calc(42vw)] md:h-auto"
            : "h-[calc(60vw)] md:h-auto md:hover:shadow-lg",
          isSubCategory ? "grid-rows-7 pb-2" : "grid-rows-4",
          "relative grid transform gap-2 overflow-hidden rounded-2xl bg-alpha-white transition hover:z-10 md:grid-rows-none  md:py md:hover:shadow-lg",
          selectedItemId === id
            ? "!border-0 outline outline-2 outline-primary"
            : "",
          className

          // "sm:max-w-full sm:max-h-full",
        )}
        onClick={onClick}
        shallow
      >
        {/* {selectedItemId === id ? <CategoryListLoader /> : <></>} */}
        <div
          className={`${
            isSubCategory ? "row-span-3 justify-center" : "justify-end"
          } flex flex-col gap-y-0.5 px-3`}
        >
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-primary">{`${digitsEnToFa(
            addCommas(productsCount ?? 0)
          )} کالا`}</p>
        </div>
        <div
          id={`category-image-${id}`}
          className={`${
            isSubCategory ? "row-span-4" : "row-span-3"
          } w-full flex-1 flex-shrink-0  transform bg-center bg-no-repeat align-middle opacity-0 transition-all duration-1000 ease-out`}
        >
          <Image
            src={src}
            // src={`/images/all-categories/${id}.png`}
            alt={title}
            width={isSubCategory ? 1600 : 1600}
            height={isSubCategory ? 900 : 1600}
            className="h-full w-full"
            loading="eager"
            onLoadingComplete={() => {
              const div =
                typeof window !== "undefined" &&
                document?.getElementById(`category-image-${id}`)
              if (div) {
                div.className = div.className + " opacity-100"
              }
            }}
          />
        </div>
      </Link>
    )
  }
)

export default CategoryListItem
