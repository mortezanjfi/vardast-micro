"use client"

import { useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { InformationCircleIcon, MapPinIcon } from "@heroicons/react/24/outline"
import { DevicePhoneMobileIcon, PhoneIcon } from "@heroicons/react/24/solid"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import CardAvatar from "@vardast/component/CardAvatar"
import Link from "@vardast/component/Link"
import {
  ContactInfoTypes,
  EventTrackerSubjectTypes,
  EventTrackerTypes,
  MessagePriceTypesEnum,
  Offer,
  Uom,
  useCreateEventTrackerMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClient from "@vardast/query/queryClients/graphqlRequestClient"
import { Button } from "@vardast/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@vardast/ui/dialog"
import clsx from "clsx"
import { formatDistanceToNow, setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import { ClientError } from "graphql-request"
import { useSession } from "next-auth/react"

import { AddressItem } from "@/app/(public)/(purchaser)/product/components/seller-contact-modal"
import PriceTitle from "@/app/components/PriceTitle"

type Props = {
  offer: Offer
  uom: Uom
  hasContactButton?: boolean
}

export const messageVariants = {
  [MessagePriceTypesEnum.Error]: "error",
  [MessagePriceTypesEnum.Info]: "info",
  [MessagePriceTypesEnum.Success]: "success"
}

const MobileProductOfferItem = ({ hasContactButton, offer, uom }: Props) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const session = useSession()
  const pathname = usePathname()

  const discount = offer.lastPublicConsumerPrice?.discount?.length
    ? offer.lastPublicConsumerPrice?.discount
    : null

  const tel = offer.seller?.contacts.find(
    (phone) => phone.type === ContactInfoTypes.Tel
  )
  const mobile = offer.seller?.contacts.find(
    (phone) => phone.type === ContactInfoTypes.Mobile
  )

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  const createEventTrackerMutation = useCreateEventTrackerMutation(
    graphqlRequestClient(session.data),
    {
      onSuccess: () => {
        setOpen(true)
      },
      onError: (errors: ClientError) => {
        router.replace(`/auth/signin${pathname}`)
        if (
          errors.response.errors?.find(
            (error) => error.extensions?.code === "FORBIDDEN"
          )
        ) {
          // toast({
          //   description:
          //     "لطفا برای مشاهده اطلاعات تماس، ابتدا وارد حساب کاربری خود شوید.",
          //   duration: 8000,
          //   variant: "default"
          // })
          console.log("redirect to login for FORBIDDEN contact visit")

          router.replace(`/auth/signin${pathname}`)
        } else {
          toast({
            description: (
              errors.response.errors?.at(0)?.extensions
                .displayErrors as string[]
            ).map((error) => error),
            duration: 8000,
            variant: "default"
          })
        }
      }
    }
  )

  const showSellerContact = () => {
    if (!!session.data) {
      createEventTrackerMutation.mutate({
        createEventTrackerInput: {
          type: EventTrackerTypes.ViewOffer,
          subjectType: EventTrackerSubjectTypes.ContactInfo,
          subjectId: offer.seller?.contacts?.at(0)?.id || 0,
          url: window.location.href
        }
      })
      return
    }
    router.replace(`/auth/signin${pathname}`)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="border-b pb">
            <CardAvatar
              url={offer.seller?.logoFile?.presignedUrl.url as string}
              name={offer.seller?.name || ""}
            />
          </DialogHeader>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 py-4">
              <div className="flex items-center justify-center rounded-lg bg-alpha-100 p">
                <DevicePhoneMobileIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex divide-x divide-alpha-200">
                {mobile && mobile?.number ? (
                  <Link
                    href={`tel:+98${mobile.number}`}
                    dir="ltr"
                    className="font-semibold underline"
                  >
                    {digitsEnToFa(`${mobile.number}`)}
                  </Link>
                ) : (
                  "_"
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 py-4">
              <div className="flex items-center justify-center rounded-lg bg-alpha-100 p">
                <PhoneIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex divide-x divide-alpha-200">
                {tel && tel.code && tel.number ? (
                  <Link
                    href={`tel:+98${+tel.code}${tel.number}`}
                    dir="ltr"
                    className="font-semibold underline"
                  >
                    {digitsEnToFa(`${tel.code}-${tel.number}`)}
                  </Link>
                ) : (
                  "_"
                )}
              </div>
            </div>

            {offer.seller?.addresses &&
              offer.seller?.addresses.length > 0 &&
              offer.seller?.addresses.map(
                ({ address, latitude, longitude, id }) => (
                  <AddressItem
                    key={id}
                    address={{
                      address,
                      latitude,
                      longitude
                    }}
                  />
                )
              )}
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col items-start gap-y-6 bg-alpha-white py">
        {/* {offer.seller.rating && offer.seller.rating > 0 ? (
          <Rating rating={offer.seller.rating} />
        ) : (
          ""
        )} */}
        <div className="flex w-full items-center gap-x-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative h-24 w-24">
              <Image
                src={offer?.seller.logoFile?.presignedUrl.url as string}
                // src="/images/frame.png"
                fill
                alt={offer?.seller.name}
                className="rounded-xl bg-white object-contain shadow-md"
              />
            </div>
            <div className="flex flex-1 flex-col gap-y-3">
              <Link
                className="text-info"
                href={`/seller/${offer?.seller.id}/${offer?.seller.name}`}
              >
                {offer?.seller.name}
              </Link>
              <div className="flex items-center gap-x-2 text-alpha-600">
                {offer?.seller?.addresses &&
                  offer?.seller?.addresses.length > 0 && (
                    <>
                      <MapPinIcon className="h-4 w-4 text-alpha-600" />
                      {offer?.seller?.addresses[0].province.name}
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
        {offer?.lastPublicConsumerPrice?.messagePrices?.length
          ? offer?.lastPublicConsumerPrice?.messagePrices.map((message) => (
              <div
                key={message?.id}
                className={clsx(
                  "border-100 flex items-center gap-x-1 rounded border p-2",
                  message?.type &&
                    `bg-${messageVariants[message?.type]}-50 border-${
                      messageVariants[message?.type]
                    }-100`
                )}
              >
                <div className="h-5 w-5">
                  <InformationCircleIcon
                    className={clsx(
                      "h-full w-full",
                      message?.type && `text-${messageVariants[message?.type]}`
                    )}
                  />
                </div>
                <p
                  className={clsx(
                    "text-xs",
                    message?.type && `text-${messageVariants[message?.type]}`
                  )}
                >
                  {message?.message}
                </p>
              </div>
            ))
          : null}
        <div className="flex w-full flex-col">
          <div className="flex justify-between">
            {offer?.lastPublicConsumerPrice?.createdAt && (
              <div className="flex flex-wrap justify-between pb text-xs text-alpha-500">
                آخرین بروزرسانی قیمت{" "}
                <span className="pr-1 font-medium text-error">
                  {offer?.lastPublicConsumerPrice?.createdAt &&
                    digitsEnToFa(
                      formatDistanceToNow(
                        new Date(
                          offer?.lastPublicConsumerPrice.createdAt
                        ).getTime(),
                        {
                          addSuffix: true
                        }
                      )
                    )}
                </span>
              </div>
            )}
            <div>
              {discount
                ? discount.map((discountItem) => (
                    <div
                      key={discountItem.id}
                      className="flex w-full items-center justify-end gap-x"
                    >
                      <span className="text-sm text-alpha-500 line-through">
                        {discountItem.calculated_price &&
                          digitsEnToFa(
                            addCommas(
                              `${offer.lastPublicConsumerPrice?.amount}`
                            )
                          )}
                      </span>
                      {discountItem.value && (
                        <span className="rounded-full bg-error p-1 px-1.5 text-center text-sm font-semibold leading-none text-white">
                          %{digitsEnToFa(discountItem.value)}
                        </span>
                      )}
                    </div>
                  ))
                : null}
            </div>
          </div>
          <div className="flex justify-between gap-x">
            <div>
              {!hasContactButton && (
                <Button
                  onClick={showSellerContact}
                  disabled={
                    (!offer.seller?.contacts.length &&
                      !offer.seller?.addresses.length) ||
                    createEventTrackerMutation.isLoading
                  }
                  loading={createEventTrackerMutation.isLoading}
                  size="small"
                  className="!py-2.5"
                  variant="outline-primary"
                >
                  اطلاعات تماس
                </Button>
              )}
            </div>
            {offer.lastPublicConsumerPrice?.amount && (
              <PriceTitle
                size="xs"
                price={
                  discount && discount.length && discount[0]?.calculated_price
                    ? +discount[0].calculated_price
                    : offer.lastPublicConsumerPrice?.amount
                }
              />
            )}
          </div>
          {offer.lastPublicConsumerPrice?.amount && uom.name && (
            <div className="flex justify-end text-xs text-alpha-500">
              <span>هر {uom.name}</span>
            </div>
          )}
        </div>
        {/* <div className="h-2 w-full bg-error"></div> */}
      </div>
    </>
  )
}

export default MobileProductOfferItem
