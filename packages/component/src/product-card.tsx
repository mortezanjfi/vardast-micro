"use client"

import { forwardRef, Ref, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import blankImage from "@vardast/asset/images/blank.png"
import frameLessImage from "@vardast/asset/images/frameLess.png"
import { Product, useCreateOfferMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { ICategoryListLoader } from "@vardast/type/Loader"
import { Button } from "@vardast/ui/button"
import { checkSellerRedirectUrl } from "@vardast/util/checkSellerRedirectUrl"
import clsx from "clsx"
import { formatDistanceToNow, setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"

import Link from "./Link"
import PriceTitle from "./PriceTitle"
import { ProductContainerType } from "./ProductListContainer"

interface ProductCardProps {
  product: Product
  homeSlider?: boolean
  isSellerPanel?: boolean
  containerType?: ProductContainerType
  selectedItemId?: ICategoryListLoader
  setSelectedItemId?: (_?: ICategoryListLoader) => void
}

export const ProductCardSkeleton = ({
  containerType = ProductContainerType.LARGE_LIST
}: {
  containerType?: ProductContainerType
}) => {
  const [ratio, setRatio] = useState(1 / 1)
  return (
    <div className="relative bg-alpha-white px-6 hover:z-10 sm:py sm:ring-2 sm:!ring-alpha-200 sm:hover:shadow-lg">
      <div
        className={clsx(
          "grid h-full w-full flex-1 gap-2 bg-alpha-white py sm:flex sm:flex-col sm:border-none sm:px-4",
          containerType === ProductContainerType.LARGE_LIST
            ? "grid-cols-3 border-b"
            : "overflow-hidden"
        )}
      >
        <div
          className={clsx(
            "relative flex flex-shrink-0 transform flex-col items-center justify-center bg-center bg-no-repeat align-middle transition-all duration-1000 ease-out"
          )}
        >
          <div className="w-full">
            <Image
              alt="skeleton"
              className="animated-card"
              height={400 / ratio}
              layout="fixed"
              objectFit="contain"
              src={frameLessImage}
              width={400}
              onLoad={({ naturalWidth, naturalHeight }: any) => {
                setRatio(naturalWidth / naturalHeight)
              }}
            />
          </div>
        </div>
        {containerType !== ProductContainerType.PHOTO && (
          <div className="sm:col-span1 col-span-2 flex flex-1 flex-col">
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

const ProductCard = forwardRef(
  (
    {
      homeSlider,
      product,
      containerType = ProductContainerType.LARGE_LIST,
      selectedItemId,
      setSelectedItemId,
      isSellerPanel
    }: ProductCardProps,
    ref: Ref<HTMLAnchorElement> | undefined
  ) => {
    const { t } = useTranslation()
    const productContainerRef = useRef<HTMLDivElement>(null)
    const [imageContainerHeight, setImageContainerHeight] = useState(146)
    const onLoadImage = () => {
      const div = productContainerRef.current
      if (div) {
        div.className = div.className + " opacity-100"
      }
    }

    setDefaultOptions({
      locale: faIR,
      weekStartsOn: 6
    })

    const createOfferMutation = useCreateOfferMutation(
      graphqlRequestClientWithToken,
      {
        onError: () => {
          toast({
            description: t("common:entity_added_error", {
              entity: t("common:offer")
            }),
            duration: 2000,
            variant: "danger"
          })
        },
        onSuccess: () => {
          toast({
            description: "کالای شما با موفقیت اضافه شد",
            duration: 2000,
            variant: "success"
          })
        }
      }
    )

    useEffect(() => {
      const div = productContainerRef.current
      if (div) {
        setImageContainerHeight(div.children[0].clientWidth)
      }
    }, [])

    const discount = product.lowestPrice?.discount?.length
      ? product.lowestPrice?.discount
      : null

    return (
      <Link
        className={clsx(
          homeSlider
            ? "relative flex items-center gap-2 border-x bg-transparent px-3 transition hover:z-10"
            : "sm:h-none relative grid h-[calc((100vw-1.5rem)/2)] max-h-[calc((100vw-1.5rem)/2)] min-h-[calc((100vw-1.5rem)/2)] w-full flex-1 gap-2 bg-alpha-white transition hover:z-10 sm:flex sm:h-full sm:max-h-full sm:min-h-full sm:flex-col sm:px-4 sm:py   sm:hover:shadow-lg",
          ref && "!border-b !border-alpha-200 sm:!border-none",

          containerType === ProductContainerType.LARGE_LIST
            ? "grid-cols-3"
            : "overflow-hidden"
          // product.id === selectedItemId && "!border-y border-primary"
        )}
        href={checkSellerRedirectUrl(`/product/${product.id}/${product.name}`)}
        ref={ref}
        onClick={() => {
          setSelectedItemId(product.id)
        }}
      >
        {product.id === selectedItemId && (
          <div className="absolute left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-alpha-white bg-opacity-50">
            {/* <Loader2Icon className="h-10 w-10 animate-spin text-primary" /> */}
          </div>
        )}
        <div
          className={clsx(
            `relative flex flex-shrink-0 transform flex-col items-center justify-center overflow-hidden rounded-2xl bg-center bg-no-repeat align-middle opacity-0 transition-all duration-1000 ease-out`,
            homeSlider && "!h-12 !w-12"
          )}
          ref={productContainerRef}
        >
          <div
            className="w-full"
            style={{
              height: imageContainerHeight
            }}
          >
            {product.images.at(0)?.file.presignedUrl.url ? (
              <Image
                alt={product.name}
                className="object-contain"
                fill
                src={product.images.at(0)?.file.presignedUrl.url}
                onLoad={onLoadImage}
              />
            ) : (
              <Image
                alt={product.name}
                className="object-contain"
                fill
                src={blankImage}
                onLoad={onLoadImage}
              />
            )}
          </div>
        </div>
        {containerType !== ProductContainerType.PHOTO && (
          <div
            className={clsx(
              "sm:col-span1 col-span-2 grid h-full grid-rows-8",
              homeSlider && "!flex gap-4"
            )}
          >
            {!homeSlider && <div></div>}
            <div
              className={clsx(
                "row-span-2",
                homeSlider && "flex !flex-shrink-0"
              )}
            >
              <h5
                className="my-auto line-clamp-2 max-h-10 overflow-hidden whitespace-pre-wrap font-semibold"
                title={product.name}
              >
                {product.name}
              </h5>
            </div>

            <div
              className={clsx(
                "flex w-full",
                homeSlider && "max-w-fit flex-shrink-0"
              )}
            >
              {/* {product.rating && product.rating > 0 ? (
                <Rating rating={product.rating} />
              ) : (
                ""
              )} */}
              {product?.lowestPrice?.createdAt && (
                <div
                  className={clsx(
                    "flex flex-wrap items-start justify-between text-xs text-alpha-500",
                    homeSlider && "!flex-nowrap !items-center"
                  )}
                >
                  آخرین بروزرسانی قیمت
                  <div className="flex gap-0.5 pr-1 font-medium text-error">
                    {product.lowestPrice.createdAt &&
                      digitsEnToFa(
                        formatDistanceToNow(
                          new Date(product.lowestPrice.createdAt).getTime()
                        )
                      )}
                    <span>قبل</span>
                  </div>
                </div>
              )}
            </div>

            {product.lowestPrice ? (
              <>
                <div
                  className={clsx(
                    "flex w-full items-center justify-end gap-x",
                    homeSlider && "!hidden"
                  )}
                >
                  {/* {discount && (
                    <span className="rounded-full bg-error p-1 px-1.5 text-center text-sm font-semibold leading-none text-white">
                      {digitsEnToFa(15)}%
                    </span>
                  )}
                  {discount && (
                    <span className="text-sm text-alpha-500 line-through">
                      {digitsEnToFa(addCommas(`${product.lowestPrice.amount}`))}
                    </span>
                  )} */}
                  {discount &&
                    discount.map((discountItem) => (
                      <div
                        className="flex w-full items-center justify-end gap-x"
                        key={discountItem.id}
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
                <div
                  className={clsx(
                    "flex w-full items-center",
                    isSellerPanel ? "justify-between" : "justify-end",
                    homeSlider && "!w-fit"
                  )}
                >
                  {isSellerPanel && (
                    <Button
                      disabled={createOfferMutation.isLoading}
                      loading={createOfferMutation.isLoading}
                      size="xsmall"
                      type="button"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.nativeEvent.preventDefault()
                        e.nativeEvent.stopImmediatePropagation()
                        createOfferMutation.mutate({
                          createOfferInput: {
                            isAvailable: true,
                            isPublic: true,
                            productId: product.id
                          }
                        })
                      }}
                    >
                      {t("common:add_entity", { entity: "به کالاهای من" })}
                    </Button>
                  )}
                  <PriceTitle
                    size="xs"
                    // price={product.lowestPrice.amount}
                    price={
                      discount &&
                      discount.length &&
                      discount[0]?.calculated_price
                        ? +discount[0].calculated_price
                        : product.lowestPrice.amount
                    }
                  />
                </div>
                <div className="flex items-center justify-end text-xs text-alpha-500">
                  {product?.uom?.name && `هر ${product.uom.name}`}
                </div>
                {!homeSlider && <div></div>}
              </>
            ) : (
              isSellerPanel && (
                <>
                  <div></div>
                  <div
                    className={clsx("flex w-full items-center justify-between")}
                  >
                    <Button
                      disabled={createOfferMutation.isLoading}
                      loading={createOfferMutation.isLoading}
                      size="xsmall"
                      type="button"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.nativeEvent.preventDefault()
                        e.nativeEvent.stopImmediatePropagation()
                        createOfferMutation.mutate({
                          createOfferInput: {
                            isAvailable: true,
                            isPublic: true,
                            productId: product.id
                          }
                        })
                      }}
                    >
                      {t("common:add_entity", { entity: "به کالاهای من" })}
                    </Button>
                  </div>
                </>
              )
            )}
          </div>
        )}
      </Link>
    )
  }
)

export default ProductCard
