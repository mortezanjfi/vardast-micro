"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "@heroicons/react/24/solid"
import { Button } from "@vardast/ui/button"

import PageTitle from "@/app/(client)/(profile)/components/PageTitle"
import AllOrderDeleteModal from "@/app/(client)/(profile)/profile/orders/components/AllOrderDeleteModal"
import OrderOffersSection from "@/app/(client)/(profile)/profile/orders/components/OrderOffersSection"

type AddOrderOfferProps = { uuid: string; title: string }

function AddOrderOffer({ title, uuid }: AddOrderOfferProps) {
  const router = useRouter()
  const [open, onOpenChange] = useState<boolean>(false)

  return (
    <>
      {" "}
      <AllOrderDeleteModal open={open} onOpenChange={onOpenChange} />
      <div className="flex h-full w-full flex-col gap-5">
        <PageTitle title={title} />
        <div className="flex items-center justify-between border-b py-5">
          <div className="flex flex-col gap-2  ">
            <span className=" pb-2 text-lg font-semibold">
              لیست کالاهای سفارش{" "}
            </span>
            <p className="text-sm">
              کالاها و هزینه های جانبی درخواستی خود را از یک یا ترکیبی از روش
              های زیر انتخاب کرده و پس از تایید، قیمت گذاری کنید.
            </p>
          </div>
          <div className="grid items-center gap-2">
            <Button
              variant="outline-primary"
              className="px-4 py-2"
              onClick={() => {
                router.push(`/profile/orders/${uuid}/addOrderProducts`)
              }}
            >
              <PlusIcon width={20} height={20} />
              اضافه کردن کالا
            </Button>
            <Button
              variant="primary"
              className="px-4 py-2"
              onClick={() => {
                onOpenChange(true)
              }}
            >
              حذف همه{" "}
            </Button>
            {/* <DropdownMenu
            modal={false}
            open={dropDownMenuOpen}
            onOpenChange={setDropDownMenuOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" iconOnly>
                <LucideMoreVertical className="icon text-black" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <>
                <DropdownMenuSeparator />
              </>
            </DropdownMenuContent>
          </DropdownMenu> */}
          </div>
        </div>
        <OrderOffersSection />
        <div
          className="flex flex-row-reverse py-5"
          onClick={() => {
            console.log("done")
            router.push(`/profile/orders`)
          }}
        >
          <Button variant="primary">ثبت نهایی</Button>
        </div>
      </div>{" "}
    </>
  )
}

export default AddOrderOffer
