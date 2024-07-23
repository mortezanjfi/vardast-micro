"use client"

import {
  Dispatch,
  forwardRef,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react"
import Image from "next/image"
import { TrashIcon } from "@heroicons/react/24/outline"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import { Product } from "@vardast/graphql/generated"
import { ICategoryListLoader } from "@vardast/type/Loader"
import { Button } from "@vardast/ui/button"
import { checkSellerRedirectUrl } from "@vardast/util/checkSellerRedirectUrl"
import clsx from "clsx"
import { formatDistanceToNow, setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

import PriceTitle from "../../..//PriceTitle"
import { ProductContainerType } from "../../..//ProductListContainer"
import { DetailsWithTitle } from "../../../desktop/DetailsWithTitle"
import Link from "../../../Link"

interface TabOrderProductCardProps {
  isDefault?: boolean
  hasDefaultButton?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
  isOffer?: boolean
  setProductIds?: Dispatch<SetStateAction<number[]>>
  product: Product
  isSellerPanel?: boolean
  containerType?: ProductContainerType
  selectedItemId?: ICategoryListLoader
  setSelectedItemId?: (_?: ICategoryListLoader) => void
}

export const TabOrderProductCardSkeleton = ({
  containerType = ProductContainerType.LARGE_LIST
}: {
  containerType?: ProductContainerType
}) => {
  const [ratio, setRatio] = useState(1 / 1)
  return (
    <div className="relative bg-alpha-white px-6 hover:z-10 sm:py sm:ring-2 sm:!ring-alpha-200 sm:hover:shadow-lg">
      <div className={clsx("flex flex-col border-b py-4")}>
        <div className="flex w-full gap-5">
          <div className="w-full">
            <Image
              src={"/images/frameLess.png"}
              alt="skeleton"
              width={400}
              height={400 / ratio}
              layout="fixed"
              onLoadingComplete={({ naturalWidth, naturalHeight }: any) => {
                setRatio(naturalWidth / naturalHeight)
              }}
              objectFit="contain"
              className="animated-card"
            />
          </div>
        </div>
        {containerType !== ProductContainerType.PHOTO && (
          <div className="sm:col-span1 col-span-2 flex h-full flex-col gap-2">
            <h5 className="animated-card line-clamp-2 h-11 font-semibold"></h5>
            <div className="flex h-8 w-full py-2">
              <div className="animated-card h-full w-8"></div>
            </div>
            <div className="flex h-14  w-full flex-col items-end">
              <div className="flex h-1/2 w-full items-center justify-end gap-x">
                <span className="animated-card h-1/2 w-8 rounded-full p-1 px-1.5 text-center text-sm font-semibold leading-none"></span>
                <span className="animated-card h-1/2 w-8 text-sm line-through"></span>
              </div>
              <div className="flex h-1/2 w-full items-center justify-end">
                <div className="animated-card h-full w-20"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const TabOrderProductCard = forwardRef(
  (
    {
      isDefault = true,
      hasDefaultButton = true,
      product,
      selectedItemId,
      setProductIds,
      isOffer,
      setOpen
    }: TabOrderProductCardProps,
    ref: Ref<HTMLAnchorElement> | undefined
  ) => {
    const { t } = useTranslation()
    const productContainerRef = useRef<HTMLDivElement>(null)
    const [imageContainerHeight, setImageContainerHeight] = useState(146)
    const [productToDelete, setProductToDelete] = useState<Product>()
    const [open, onOpenChange] = useState<boolean>(false)

    const onLoadingCompletedImage = () => {
      const div = productContainerRef.current
      if (div) {
        div.className = div.className + " opacity-100"
      }
    }

    setDefaultOptions({
      locale: faIR,
      weekStartsOn: 6
    })

    useEffect(() => {
      const div = productContainerRef.current
      if (div) {
        setImageContainerHeight(div.children[0].clientWidth)
      }
    }, [])

    const discount = product.lowestPrice?.discount?.length
      ? product.lowestPrice?.discount
      : null

    const addProduct = (id: number) => {
      if (setProductIds) setProductIds((prev) => [...prev, id])
    }

    return (
      <>
        {/* <ProductDeleteModal
          productToDelete={productToDelete}
          open={open}
          onOpenChange={onOpenChange}
        /> */}
        <Link
          ref={ref}
          href={checkSellerRedirectUrl(
            `/product/${product.id}/${product.name}`
          )}
          onClick={(e) => {
            e.preventDefault()
          }}
          className={clsx(
            "flex flex-col border-b py-4",
            !isDefault && "!border-none"
          )}
          prefetch={false}
        >
          <div className="flex w-full gap-5">
            {product.id === selectedItemId && (
              <div className="absolute left-0 top-0 z-50 flex w-full flex-col items-center justify-center bg-alpha-white bg-opacity-50">
                {/* <Loader2Icon className="h-10 w-10 animate-spin text-primary" /> */}
              </div>
            )}
            <div
              ref={productContainerRef}
              className={`relative flex flex-shrink-0 transform flex-col items-center justify-center bg-center bg-no-repeat align-middle opacity-0 transition-all duration-1000 ease-out`}
            >
              <div
                style={{
                  height: imageContainerHeight
                }}
                className="w-[119px]"
              >
                {product.images.at(0)?.file.presignedUrl.url ? (
                  <Image
                    src={product.images.at(0)?.file.presignedUrl.url as string}
                    alt={product.name}
                    fill
                    className="object-contain"
                    onLoadingComplete={onLoadingCompletedImage}
                  />
                ) : (
                  <Image
                    src={"/images/blank.png"}
                    alt={product.name}
                    fill
                    className="object-contain"
                    onLoadingComplete={onLoadingCompletedImage}
                  />
                )}
              </div>
            </div>

            <div className="sm:col-span1 col-span-2 flex h-full flex-col gap-2">
              <div className="pb-3">
                <h5
                  title={product.name}
                  className="my-auto line-clamp-2 max-h-10 overflow-hidden whitespace-pre-wrap font-semibold"
                >
                  {product.name}
                </h5>
              </div>
              {isDefault ? (
                <>
                  {" "}
                  <div className="flex w-full">
                    {/* {product.rating && product.rating > 0 ? (
                <Rating rating={product.rating} />
              ) : (
                ""
              )} */}
                    {product?.lowestPrice?.createdAt && (
                      <div className="flex flex-wrap items-center justify-between text-xs text-alpha-500">
                        {t("common:last-price-update")}
                        <span className="pr-1 font-medium text-error">
                          {product.lowestPrice.createdAt &&
                            digitsEnToFa(
                              formatDistanceToNow(
                                new Date(
                                  product.lowestPrice.createdAt
                                ).getTime(),
                                {
                                  addSuffix: true
                                }
                              )
                            )}
                        </span>
                      </div>
                    )}
                  </div>
                  {discount && (
                    <div className="flex w-full items-center  gap-x">
                      <span className="rounded-full bg-error p-1 px-1.5 text-center text-sm font-semibold leading-none text-white">
                        {digitsEnToFa(15)}%
                      </span>

                      <span className="text-sm text-alpha-500 line-through">
                        {digitsEnToFa(
                          addCommas(`${product?.lowestPrice?.amount}`)
                        )}
                      </span>

                      {discount.map((discountItem) => (
                        <div
                          key={discountItem.id}
                          className="flex w-full items-center justify-end gap-x"
                        >
                          <span className="text-sm text-alpha-500 line-through">
                            {discountItem.calculated_price &&
                              product?.lowestPrice?.amount &&
                              digitsEnToFa(
                                addCommas(`${product.lowestPrice.amount}`)
                              )}
                          </span>
                          {discountItem.value && (
                            <span className="rounded-full bg-error p-1 px-1.5 text-center text-sm font-semibold leading-none text-white">
                              %{digitsEnToFa(discountItem.value)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={clsx("flex w-full items-center")}>
                    <PriceTitle
                      size="xs"
                      // price={product.lowestPrice.amount}
                      price={
                        discount &&
                        discount.length &&
                        discount[0]?.calculated_price
                          ? +discount[0].calculated_price
                          : (product?.lowestPrice?.amount as number)
                      }
                    />
                  </div>
                  <div className="flex items-center text-xs text-alpha-500">
                    {product?.uom?.name && `هر ${product.uom.name}`}
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  <DetailsWithTitle
                    className="text-sm"
                    title={t("common:brand")}
                    text={product?.brand?.name}
                  />
                  <DetailsWithTitle
                    className="text-sm"
                    title={t("common:unit")}
                    text={product?.uom?.name}
                  />
                  <DetailsWithTitle
                    className="text-sm"
                    title={t("common:value")}
                    text={""}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full justify-end gap-5">
            {isOffer ? (
              <Button
                className="py-3"
                variant="full-secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  e.nativeEvent.preventDefault()
                  e.nativeEvent.stopImmediatePropagation()
                  console.log(product.id)
                  if (setOpen) setOpen(true)
                }}
              >
                {t("common:add_entity", { entity: t("common:price") })}
              </Button>
            ) : hasDefaultButton ? (
              <Button
                variant="outline-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  e.nativeEvent.preventDefault()
                  e.nativeEvent.stopImmediatePropagation()
                  console.log(product.id)
                  addProduct(product.id)
                }}
                className="py-3"
              >
                {t("common:add-to_entity", { entity: t("common:order") })}
              </Button>
            ) : null}
            {isOffer && (
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  e.nativeEvent.preventDefault()
                  e.nativeEvent.stopImmediatePropagation()
                  setProductToDelete(product)
                  onOpenChange(true)
                  console.log("trash")
                }}
              >
                <TrashIcon width={24} height={24} className="text-alpha-800" />
              </Button>
            )}
          </div>
        </Link>
      </>
    )
  }
)

export default TabOrderProductCard
