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
import { ClientError } from "graphql-request"
import { PhoneIcon } from "lucide-react"
import { Session } from "next-auth"

import { AddressItem } from "@/app/(client)/product/components/seller-contact-modal"

type ProductLowestPriceInfoProps = {
  lowestPrice: Price
  uom: string
  session: Session | null
}

const ProductLowestPriceInfo = ({
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
    if (!!session) {
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
  // const discount = queryProduct?.data?.product?.lowestPrice?.discount?.length
  //   ? lowestPrice?.discount[0].value
  //   : null

  const tel = mainOffer?.seller.contacts.find(
    (phone) => phone.type === ContactInfoTypes.Tel
  )
  const mobile = lowestPrice?.seller.contacts.find(
    (phone) => phone.type === ContactInfoTypes.Mobile
  )

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="border-b pb">
            <CardAvatar
              url={
                (lowestPrice?.seller.logoFile?.presignedUrl.url as string) ||
                "/images/seller-blank.png"
              }
              name={mainOffer?.seller?.name || ""}
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
                    href={`tel:+98${tel.number}`}
                    dir="ltr"
                    className="font-semibold underline"
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
                    href={`mobile:+98${+mobile.code}${mobile.number}`}
                    dir="ltr"
                    className="font-semibold underline"
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
      <div className="flex flex-col gap-3 bg-alpha-white pb-9">
        <div className="flex gap-2">
          {lowestPrice.discount && (
            <>
              <span className="text-alpha-500 line-through">
                {digitsEnToFa(addCommas(lowestPrice.amount as number))}
              </span>
              <span>تومان</span>
              <DiscountBadge
                discount={lowestPrice?.discount[0].value as unknown as number}
              />
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Button
            onClick={showSellerContact}
            disabled={
              (!lowestPrice.seller?.contacts.length &&
                !lowestPrice.seller?.addresses.length) ||
              createEventTrackerMutation.isLoading
            }
            loading={createEventTrackerMutation.isLoading}
            size="xlarge"
            className="h-12 px-4 text-lg font-normal"
            variant="primary"
          >
            اطلاعات تماس
          </Button>
          <div className="flex flex-col">
            {lowestPrice?.amount ? (
              <>
                {" "}
                <div className="flex flex-col items-start gap-1">
                  <div className="text-2xl font-semibold text-alpha-800">
                    <PriceTitle
                      price={lowestPrice?.amount as number}
                      size="large"
                    />
                  </div>
                  <span className="flex w-full justify-end text-alpha-500">
                    هر {uom}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductLowestPriceInfo
