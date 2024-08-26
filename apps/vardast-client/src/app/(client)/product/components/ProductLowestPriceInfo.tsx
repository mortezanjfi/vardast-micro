import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline"
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools"
import CardAvatar from "@vardast/component/CardAvatar"
import DiscountBadge from "@vardast/component/DiscountBadge"
import Link from "@vardast/component/Link"
import PriceTitle from "@vardast/component/PriceTitle"
import {
  ContactInfoTypes,
  EventTrackerSubjectTypes,
  EventTrackerTypes,
  Price,
  useCreateEventTrackerMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import paths from "@vardast/lib/paths"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@vardast/ui/dialog"
import { formatDistanceToNow } from "date-fns"
import { ClientError } from "graphql-request"
import { PhoneIcon } from "lucide-react"
import { Session } from "next-auth"

import { AddressItem } from "@/app/(client)/product/components/seller-contact-modal"

type ProductLowestPriceInfoProps = {
  isMobileView: boolean
  lowestPrice: Price
  uom: string
  session: Session | null
}

const ProductLowestPriceInfo = ({
  isMobileView,
  lowestPrice,
  uom,
  session
}: ProductLowestPriceInfoProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const createEventTrackerMutation = useCreateEventTrackerMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        setOpen(true)
      },
      onError: (errors: ClientError) => {
        router.replace(`${paths.signin}?ru=${pathname}`)
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

          router.replace(`${paths.signin}?ru=${pathname}`)
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
    if (session) {
      createEventTrackerMutation.mutate({
        createEventTrackerInput: {
          type: EventTrackerTypes.ViewOffer,
          subjectType: EventTrackerSubjectTypes.ContactInfo,
          subjectId: mainOffer?.seller?.contacts?.at(0)?.id || 0,
          url: window.location.href
        }
      })
      return
    }
    router.replace(`${paths.signin}?ru=${pathname}`)
  }

  const mainOffer = lowestPrice
  const discount = lowestPrice?.discount?.length ? lowestPrice?.discount : null

  const tel = mainOffer?.seller.contacts.find(
    (phone) => phone.type === ContactInfoTypes.Tel
  )
  const mobile = lowestPrice?.seller.contacts.find(
    (phone) => phone.type === ContactInfoTypes.Mobile
  )

  return (
    <>
      {/* modal for contact info */}
      {!isMobileView && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader className="border-b pb">
              <CardAvatar
                name={mainOffer?.seller?.name || ""}
                url={
                  (lowestPrice?.seller.logoFile?.presignedUrl.url) ||
                  "/images/seller-blank.png"
                }
              />
            </DialogHeader>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 py-4">
                {" "}
                <div className="flex items-center justify-center rounded-lg bg-alpha-100 p">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex divide-x divide-alpha-200">
                  {tel && tel?.number ? (
                    <Link
                      className="font-semibold underline"
                      dir="ltr"
                      href={`tel:+98${tel.number}`}
                    >
                      {digitsEnToFa(`${tel.number}`)}
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
                  {mobile && mobile.code && mobile.number ? (
                    <Link
                      className="font-semibold underline"
                      dir="ltr"
                      href={`mobile:+98${+mobile.code}${mobile.number}`}
                    >
                      {digitsEnToFa(`${mobile.code}-${mobile.number}`)}
                    </Link>
                  ) : (
                    "_"
                  )}
                </div>
              </div>

              {mainOffer?.seller?.addresses &&
                mainOffer?.seller?.addresses.length > 0 &&
                mainOffer?.seller?.addresses.map(
                  ({ address, latitude, longitude, id }) => (
                    <AddressItem
                      address={{
                        address,
                        latitude,
                        longitude
                      }}
                      key={id}
                    />
                  )
                )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* ------------------- */}

      <div className="flex flex-col gap-3 bg-alpha-white">
        {lowestPrice.discount && (
          <div className="flex gap-2">
            <span className="text-alpha-500 line-through">
              {digitsEnToFa(addCommas(lowestPrice.amount))}
            </span>
            <span>تومان</span>
            <DiscountBadge
              discount={lowestPrice?.discount[0].value as unknown as number}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          {!isMobileView && (
            <Button
              className=" font-normal"
              disabled={
                (!lowestPrice.seller?.contacts.length &&
                  !lowestPrice.seller?.addresses.length) ||
                createEventTrackerMutation.isLoading
              }
              loading={createEventTrackerMutation.isLoading}
              size="medium"
              variant="primary"
              onClick={showSellerContact}
            >
              اطلاعات تماس
            </Button>
          )}
          <div className="mr-auto flex flex-col justify-between gap-y">
            {discount &&
              discount.map((discountItem) => (
                <div
                  className="flex w-full items-center justify-end gap-x"
                  key={discountItem.id}
                >
                  <span className="text-sm text-alpha-500 line-through">
                    {discountItem.calculated_price &&
                      lowestPrice?.amount &&
                      digitsEnToFa(addCommas(`${lowestPrice.amount}`))}
                  </span>
                  {discountItem.value && (
                    <span className="rounded-full bg-error p-1 px-1.5 text-center text-sm font-semibold leading-none text-white">
                      %{digitsEnToFa(discountItem.value)}
                    </span>
                  )}
                </div>
              ))}
            {lowestPrice && (
              <div className="flex items-center gap-2">
                {uom && (
                  <span className="mr-auto flex justify-between text-xs text-alpha-500">
                    هر {uom}
                  </span>
                )}
                <PriceTitle
                  size="xs"
                  // price={lowestPrice.amount}
                  price={
                    discount && discount.length && discount[0]?.calculated_price
                      ? +discount[0].calculated_price
                      : lowestPrice.amount
                  }
                />{" "}
              </div>
            )}
            {lowestPrice?.createdAt && (
              <div className="flex flex-wrap items-center justify-between text-xs text-alpha-500">
                آخرین بروزرسانی قیمت{" "}
                <span className="pr-1 font-medium text-error">
                  {lowestPrice.createdAt &&
                    digitsEnToFa(
                      formatDistanceToNow(
                        new Date(lowestPrice.createdAt).getTime(),
                        {
                          addSuffix: true
                        }
                      )
                    )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductLowestPriceInfo
