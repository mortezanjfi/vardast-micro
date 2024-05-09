"use client"

import { forwardRef, Ref, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { PlayIcon, TrashIcon } from "@heroicons/react/24/solid"
import { useQueryClient } from "@tanstack/react-query"
import Link from "@vardast/component/Link"
import PriceTitle from "@vardast/component/PriceTitle"
import { ProductContainerType } from "@vardast/component/ProductListContainer"
import {
  Product,
  ThreeStateSupervisionStatuses,
  useRemoveOfferMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClient from "@vardast/query/queryClients/graphqlRequestClient"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { ICategoryListLoader } from "@vardast/type/Loader"
import { Button } from "@vardast/ui/button"
import { checkSellerRedirectUrl } from "@vardast/util/checkSellerRedirectUrl"
import clsx from "clsx"
import { ClientError } from "graphql-request"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

import CreatePriceModal from "@/app/(seller)/products/components/CreatePriceModal"

interface ProductCardProps {
  product: Product
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
    <div className="relative bg-alpha-white px-6 hover:z-10 md:py md:hover:shadow-lg">
      <div
        className={clsx(
          "grid h-full w-full flex-1 gap-2 bg-alpha-white py md:border-none lg:flex lg:flex-col lg:px-4",
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
              src={"/images/frameLess.png"}
              alt="skeleton"
              width={400}
              height={400 / ratio}
              layout="fixed"
              onLoad={({ naturalWidth, naturalHeight }: any) => {
                setRatio(naturalWidth / naturalHeight)
              }}
              objectFit="contain"
              className="animated-card"
            />
          </div>
        </div>
        {containerType !== ProductContainerType.PHOTO && (
          <div className="lg:col-span1 col-span-2 flex flex-1 flex-col">
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
      product,
      containerType = ProductContainerType.LARGE_LIST,
      selectedItemId,
      setSelectedItemId
    }: ProductCardProps,
    ref: Ref<HTMLAnchorElement> | undefined
  ) => {
    const queryClient = useQueryClient()
    const { data: session } = useSession()

    const { t } = useTranslation()
    const [createPriceModalOpen, setCreatePriceModalOpen] =
      useState<boolean>(false)
    const productContainerRef = useRef<HTMLDivElement>(null)
    const [imageContainerHeight, setImageContainerHeight] = useState(146)
    const onLoaddImage = () => {
      const div = productContainerRef.current
      if (div) {
        div.className = div.className + " opacity-100"
      }
    }

    const removeOfferMutation = useRemoveOfferMutation(
      graphqlRequestClient(session),
      {
        onError: (errors: ClientError) => {
          toast({
            description: (
              errors?.response?.errors?.at(0)?.extensions
                ?.displayErrors as string[]
            )?.map((error) => error),
            duration: 2000,
            variant: "danger"
          })
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_FUNCTIONS_KEY.GET_M_PROFILE_SELLER]
          })
          toast({
            description: "کالا با موفقیت از لیست کالاهای شما حذف شد",
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

    return (
      <>
        {createPriceModalOpen && (
          <CreatePriceModal
            open={createPriceModalOpen}
            onOpenChange={setCreatePriceModalOpen}
            product={product}
          />
        )}
        <Link
          ref={ref}
          href={checkSellerRedirectUrl(
            `/product/${product.id}/${product.name}`
          )}
          onClick={(e) => {
            createPriceModalOpen && e.preventDefault()
            !createPriceModalOpen &&
              setSelectedItemId &&
              setSelectedItemId(product.id)
          }}
          className={clsx(
            "md:h-none relative grid h-[calc((100vw-1.5rem)/2)] max-h-[calc((100vw-1.5rem)/2)] min-h-[calc((100vw-1.5rem)/2)] w-full flex-1 gap-2 bg-alpha-white transition hover:z-10 md:h-full md:max-h-full md:min-h-full md:py md:ring-1 md:!ring-alpha-200 md:hover:shadow-lg lg:flex lg:flex-col lg:px-4",
            ref && "!border-b !border-alpha-200 md:!border-none",
            containerType === ProductContainerType.LARGE_LIST
              ? "grid-cols-3"
              : "overflow-hidden"
            // product.id === selectedItemId && "!border-y border-primary"
          )}
          prefetch={false}
        >
          {product.id === selectedItemId && (
            <div className="absolute left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-alpha-white bg-opacity-50">
              {/* <Loader2Icon className="h-10 w-10 animate-spin text-primary" /> */}
            </div>
          )}
          <div className="grid grid-rows-5">
            <div></div>
            <div
              ref={productContainerRef}
              className={`relative row-span-2 flex flex-shrink-0 transform flex-col items-center justify-center bg-center bg-no-repeat align-middle opacity-0 transition-all duration-1000 ease-out`}
            >
              <div
                style={{
                  height: imageContainerHeight / 2
                }}
                className="grid w-full grid-rows-2"
              >
                {product.images.at(0)?.file.presignedUrl.url ? (
                  <Image
                    src={product.images.at(0)?.file.presignedUrl.url as string}
                    alt={product.name}
                    fill
                    className="object-contain"
                    onLoad={onLoaddImage}
                  />
                ) : (
                  <Image
                    src={"/images/blank.png"}
                    alt={product.name}
                    fill
                    className="object-contain"
                    onLoad={onLoaddImage}
                  />
                )}
              </div>
            </div>
            <div className="row-span-2 flex flex-col items-center justify-center gap-y">
              <div className="flex justify-start gap-x-1">
                <p className="whitespace-pre text-xs text-alpha-400">
                  قیمت من:
                </p>
              </div>
              <div className="flex w-full items-center justify-center">
                <PriceTitle size="xs" price={product?.myPrice?.amount ?? 0} />
              </div>
            </div>
          </div>
          {containerType !== ProductContainerType.PHOTO && (
            <div className="lg:col-span1 col-span-2 grid h-full grid-rows-5 py">
              <div className="row-span-2">
                <h5
                  title={product.name}
                  className="my-auto line-clamp-2 max-h-10 overflow-hidden whitespace-pre-wrap font-semibold"
                >
                  {product.name}
                </h5>
              </div>

              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex justify-start gap-x-1">
                    <PlayIcon className="h-4 w-4 -rotate-90 transform text-success transition" />
                    <p className="whitespace-pre text-xs text-success">
                      بیشترین قیمت
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-end">
                    <PriceTitle
                      color="success"
                      size="xs"
                      price={product?.highestPrice?.amount ?? 0}
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex justify-start gap-x-1">
                    <PlayIcon className="h-4 w-4 rotate-90 transform text-error transition" />
                    <p className="whitespace-pre text-xs text-error">
                      کمترین قیمت
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-end">
                    <PriceTitle
                      color="error"
                      size="xs"
                      price={product?.lowestPrice?.amount ?? 0}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                {product.status === ThreeStateSupervisionStatuses.Confirmed && (
                  <span className="tag tag-light tag-sm tag-success">
                    {t("common:confirmed")}
                  </span>
                )}
                {product.status === ThreeStateSupervisionStatuses.Pending && (
                  <span className="tag tag-light tag-sm tag-warning">
                    {t("common:pending")}
                  </span>
                )}
                {product.status === ThreeStateSupervisionStatuses.Rejected && (
                  <span className="tag tag-light tag-sm tag-danger">
                    {t("common:rejected")}
                  </span>
                )}
                <div className="flex items-center justify-end gap-x-1.5">
                  {product.status ===
                    ThreeStateSupervisionStatuses.Confirmed && (
                    <>
                      <Button
                        iconOnly
                        loading={removeOfferMutation.isLoading}
                        disabled={removeOfferMutation.isLoading}
                        variant="secondary"
                        size="small"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.nativeEvent.preventDefault()
                          e.nativeEvent.stopImmediatePropagation()
                          removeOfferMutation.mutate({ productId: product.id })
                        }}
                      >
                        <TrashIcon
                          className="h-4 w-4 text-error"
                          strokeWidth={1.5}
                        />
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.nativeEvent.preventDefault()
                          e.nativeEvent.stopImmediatePropagation()
                          setCreatePriceModalOpen(true)
                        }}
                      >
                        {t("common:edit_entity", { entity: t("common:price") })}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </Link>
      </>
    )
  }
)

export default ProductCard
