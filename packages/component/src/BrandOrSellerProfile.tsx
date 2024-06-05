"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { CheckBadgeIcon } from "@heroicons/react/24/solid"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { UseQueryResult } from "@tanstack/react-query"
import blankImage from "@vardast/asset/images/blank.png"
import sellerUserImage from "@vardast/asset/images/seller-user.png"
import {
  EntityTypeEnum,
  GetBrandQuery,
  GetIsFavoriteQuery,
  GetSellerQuery
} from "@vardast/graphql/generated"
import { setBreadCrumb } from "@vardast/provider/LayoutProvider"
import {
  Segments,
  SegmentsContent,
  SegmentsList,
  SegmentsListItem
} from "@vardast/ui/segment"
import convertToPersianDate from "@vardast/util/convertToPersianDate"
import clsx from "clsx"
import { setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import useTranslation from "next-translate/useTranslation"
import { useQueryState } from "next-usequerystate"

import FavoriteIcon from "./FavoriteIcon"
import ShareIcon from "./ShareIcon"

export type BrandOrSellerProfileTab = {
  value: string
  title: JSX.Element
  Content: () => JSX.Element
  className?: string | undefined
}
export type SellerQuery = GetSellerQuery["seller"]
export type BrandQuery = GetBrandQuery["brand"]

interface IBrandOrSellerProfile {
  slug: Array<string | number>
  type: EntityTypeEnum.Brand | EntityTypeEnum.Seller
  data?: SellerQuery | BrandQuery
  isFavoriteQuery: UseQueryResult<GetIsFavoriteQuery, unknown>
  tabs: BrandOrSellerProfileTab[]
  isMobileView: boolean
}

export const TabTitleWithExtraData = ({
  total,
  title = "",
  createdDate
}: {
  total?: number
  createdDate?: string
  title: string
}) => {
  return (
    <div className="flex items-center justify-center gap-x-2">
      <span className="font-semibold">{title}</span>
      {total ? (
        <span className="text-xs">({digitsEnToFa(total)})</span>
      ) : createdDate ? (
        <span className="text-xs">
          ({digitsEnToFa(convertToPersianDate({ dateString: createdDate }))})
        </span>
      ) : null}
    </div>
  )
}

const BrandOrSellerProfile = ({
  type,
  data,
  slug,
  isFavoriteQuery,
  tabs,
  isMobileView
}: IBrandOrSellerProfile) => {
  if (!data) notFound()
  const [openTabName, setOpenTabName] = useQueryState("tab")
  const [activeTab, setActiveTab] = useState<string>("")
  const { t } = useTranslation()
  const isSellerQuery = () => type === EntityTypeEnum.Seller

  setBreadCrumb({
    dynamic: false,
    items: [
      {
        label: t(isSellerQuery() ? "common:sellers" : "common:brands"),
        path: "/brands",
        isCurrent: false
      },
      {
        label: data.name,
        path: `${isSellerQuery() ? `sellers/${data.id}` : `brands/${data.id}`}`,
        isCurrent: true
      }
    ]
  })

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  useEffect(() => {
    setActiveTab(openTabName || tabs[0].value)
  }, [openTabName, tabs])

  return (
    <div className="flex h-full flex-col bg-alpha-white md:gap-9">
      <div className="w-full md:flex md:gap-9">
        <div className="relative flex flex-col justify-start overflow-hidden md:w-[250px] md:min-w-[200px] md:flex-shrink-0 md:justify-center md:rounded-2xl md:border-2">
          <div className="flex flex-col gap-y bg-alpha-white px py-5 md:py-9">
            <div className="grid h-full grid-cols-9 items-center justify-center gap-y bg-alpha-white px py-5 md:flex md:py-9">
              <div></div>
              <div className="col-span-7 flex flex-col items-center justify-center">
                <div className="rounded-full border-2 border-alpha-400 p-0.5 md:h-full">
                  {isSellerQuery() && (data as SellerQuery).isBlueTik && (
                    <>
                      <CheckBadgeIcon className="w-h-7 absolute right-1 top-0 z-20 h-7 -translate-y-1 translate-x-1 text-info" />
                      <span className="absolute right-2 top-1 h-3 w-3 rounded-full bg-alpha-white"></span>
                    </>
                  )}
                  <div className="aspect-square">
                    <Image
                      src={
                        data?.logoFile?.presignedUrl.url
                          ? data?.logoFile?.presignedUrl.url
                          : sellerUserImage
                      }
                      alt="seller"
                      width={100}
                      height={100}
                      className="h-full w-full rounded-full object-contain"
                    />
                  </div>
                </div>
                {(!isMobileView || isSellerQuery()) && (
                  <div className="flex flex-col items-center gap-y-2 pt">
                    <p>{data.name}</p>
                    {data?.addresses?.length > 0 &&
                      data.addresses[0].city.name && (
                        <p className="flex h-4 items-center gap-x-1 py-1 text-xs text-alpha-600">
                          <MapPinIcon className="h-3 w-3 text-alpha-600" />
                          {data.addresses[0].city.name}
                        </p>
                      )}
                  </div>
                )}
              </div>
              <div className="hidden md:block"></div>
              <div className="left-3 top-3 flex h-full flex-col justify-start md:absolute">
                <FavoriteIcon
                  entityId={+slug[0]}
                  isFavoriteQuery={isFavoriteQuery}
                  type={type}
                />
                <ShareIcon name={data.name} />
              </div>
            </div>
          </div>
        </div>
        {!isMobileView && (
          <div className="relative hidden aspect-auto w-full overflow-hidden rounded-2xl md:col-span-9 md:block">
            <Image
              src={
                data.bannerFile?.presignedUrl.url
                  ? `${data.bannerFile?.presignedUrl.url}`
                  : blankImage
              }
              className="h-full w-full object-cover"
              alt="banner"
              fill
            />
          </div>
        )}
      </div>

      <Segments
        value={activeTab}
        onValueChange={(value) => {
          if (value === tabs[0].value) {
            setOpenTabName(null)
            setActiveTab(value)
            return
          }
          setOpenTabName(value)
        }}
        className="sticky left-0 right-0 top-0 h-full flex-col  gap-9 bg-alpha-white sm:flex md:mt md:w-full md:overflow-visible"
      >
        <SegmentsList wrap className="border-b pb  md:border-b-2 md:pb-5">
          {tabs.map(({ title, value }) => (
            <SegmentsListItem
              key={value}
              noStyle
              className={clsx("no-select")}
              value={value}
              style={{
                width:
                  !isMobileView || tabs.length > 3
                    ? "auto"
                    : `${100 / tabs.length}%`
              }}
            >
              <>
                <div
                  className={clsx(
                    "mx-1 cursor-pointer rounded-full border bg-alpha-white px-4 py-2.5 text-sm",
                    value === activeTab
                      ? "border-primary bg-primary text-alpha-white"
                      : "border-alpha-300"
                  )}
                >
                  {title}
                </div>
              </>
            </SegmentsListItem>
          ))}
        </SegmentsList>
        {tabs.map(({ Content, className, ...props }) => (
          <SegmentsContent
            className={clsx("flex-1", className)}
            key={props.value}
            value={props.value}
          >
            <Content />
          </SegmentsContent>
        ))}
      </Segments>
    </div>
  )
}

export default BrandOrSellerProfile
