"use client"

import Image from "next/image"
import { CubeIcon, Squares2X2Icon } from "@heroicons/react/24/outline"
import {
  PhoneArrowDownLeftIcon,
  StarIcon,
  UserCircleIcon
} from "@heroicons/react/24/solid"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { useQuery } from "@tanstack/react-query"
import {
  GetCountTotalEventQuery,
  GetMyProfileSellerQuery
} from "@vardast/graphql/generated"
import { _seller_card_Items, _seller_menu_item } from "@vardast/lib/constants"
import { getCountTotalEventQueryFns } from "@vardast/query/queryFns/getCountTotalEventQueryFns"
import { getMyProfileSellerQueryFns } from "@vardast/query/queryFns/getMyProfileSellerQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { ColorEnum } from "@vardast/type/Enums"
import { ISellerMobileAnalyzeProps } from "@vardast/type/Seller"
import { Session } from "next-auth"

import { CountItem } from "@/app/(seller)/components/CountItem"
import { DesktopMenuCard } from "@/app/(seller)/components/DesktopMenuCard"
import { SellerHomeItem } from "@/app/(seller)/components/SellerHomeItem"
import SellerPastDurationEventsChart from "@/app/(seller)/components/SellerPastDurationEventsChart"

type SellerHomeIndexType = {
  session: Session | null
  isMobileView: boolean
}

const SellerHomeIndex = ({ session, isMobileView }: SellerHomeIndexType) => {
  const myProfileQuery = useQuery<GetMyProfileSellerQuery>(
    [QUERY_FUNCTIONS_KEY.GET_M_PROFILE_SELLER],
    () =>
      getMyProfileSellerQueryFns({
        accessToken: session?.accessToken
      }),
    {
      refetchOnMount: "always"
    }
  )

  const countEventQuery = useQuery<GetCountTotalEventQuery>(
    [QUERY_FUNCTIONS_KEY.GET_COUNT_EVENT],
    () => getCountTotalEventQueryFns(session?.accessToken),
    {
      refetchOnMount: "always"
    }
  )

  const _analyze_cards: ISellerMobileAnalyzeProps[] = [
    {
      id: "4",
      Icon: Squares2X2Icon,
      title: "تعداد دسته‌بندی‌ها",
      value: myProfileQuery.data?.myProfileSeller.myProduct.length,
      bgColor: ColorEnum.INFO
    },
    {
      id: "1",
      Icon: CubeIcon,
      title: "کالاهای من",
      value: myProfileQuery.data?.myProfileSeller.myProduct.length,
      bgColor: ColorEnum.ERROR
    },
    {
      id: "2",
      Icon: PhoneArrowDownLeftIcon,
      title: "بازدید اطلاعات تماس",
      value: countEventQuery.data?.pastDurationEventsCount.totalCount,
      bgColor: ColorEnum.SUCCESS
    },
    {
      id: "3",
      Icon: StarIcon,
      title: "امتیاز عملکرد شما",
      value: myProfileQuery.data?.myProfileSeller.rating,
      bgColor: ColorEnum.WARNING
    }
  ]

  return (
    <>
      {isMobileView ? (
        <div className="flex flex-1 flex-col gap-y-0.5">
          <div className="flex w-full justify-between bg-alpha-white p">
            <div className="flex items-center gap-x">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                {myProfileQuery.data?.myProfileSeller.logoFile ? (
                  <Image
                    src={
                      myProfileQuery.data?.myProfileSeller.logoFile
                        ?.presignedUrl.url ?? ""
                    }
                    alt="category"
                    fill
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <UserCircleIcon className="h-full w-full text-secondary" />
                )}
              </div>
              <div className="flex flex-col gap-y-1">
                <h4 className="font-semibold">
                  {myProfileQuery.data?.myProfileSeller.name
                    ? myProfileQuery.data?.myProfileSeller.name
                    : "فروشنده وردست"}
                </h4>
                <p className="text-sm font-semibold text-alpha-400">
                  {session?.profile?.cellphone
                    ? digitsEnToFa(session?.profile?.cellphone)
                    : digitsEnToFa("09123456789")}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap bg-alpha-white p">
            {_analyze_cards.map((item) => (
              <CountItem isMobileView={isMobileView} key={item.id} {...item} />
            ))}
          </div>
          <div className="flex-1 bg-alpha-white">
            <div className="grid grid-cols-3 gap-x p">
              {_seller_menu_item.map((item) => (
                <SellerHomeItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-7">
          <div className="grid grid-cols-4 gap-7 ">
            {_analyze_cards.map((item) => (
              <CountItem key={item.id} {...item} />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-7">
            {_seller_card_Items.map((item) => (
              <DesktopMenuCard key={item.id} {...item} />
            ))}
          </div>
          <SellerPastDurationEventsChart />
        </div>
      )}
    </>
  )
}

export default SellerHomeIndex
